import * as R from 'ramda'
import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import {
  SAVE_CREATE_CHECK,
  DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK,
  DETAIL_TABLE_EDIT_SUBMIT_CHECK,
  INDEX_EDIT_SUBMIT_CHECK
} from '../actionConsts'
import { tableChangedFields, fieldChanged } from '../utils/helpers'
import { makeErrorsFromMissingFields } from '../utils/validation'
import * as Actions from '../actions'
import { Epic } from './epic'
import { EpicPayload } from '../types'

export class ValidationEpic extends Epic {
  getRequiredFields = (modelName: string) => {
    return R.filter(
      (val) => val !== 'id',
      this.schema.getRequiredFields(modelName)
    )
  }

  [SAVE_CREATE_CHECK](action$: any, state$: any) {
    return action$.pipe(
      ofType(SAVE_CREATE_CHECK),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const modelName = R.prop('modelName', payload) as string
        const stack = R.path(
          ['value', 'conveyor', 'create', 'stack'],
          state$
        ) as any[]
        const fields: any = R.path([stack.length - 1, 'fields'], stack)
        const requiredFields = this.getRequiredFields(modelName)
        const missingFields = requiredFields.filter(
          (fieldName: any) => !(fieldName in fields)
        )

        if (!R.isEmpty(missingFields)) {
          return Actions.onValidationErrorCreate({
            errors: makeErrorsFromMissingFields(missingFields)
          })
        } else {
          return Actions.onSaveCreate({ ...payload })
        }
      })
    )
  }

  [DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK](action$: any, state$: any) {
    return action$.pipe(
      ofType(DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const modelName = R.prop('modelName', payload) as string
        const fieldName = R.prop('fieldName', payload) as string
        const id = R.prop('id', payload) as string
        const fieldEdit = R.path(
          [
            'value',
            'conveyor',
            'edit',
            modelName,
            id,
            fieldName
          ],
          state$
        )
        const currentValue = R.prop<any, any>('currentValue', fieldEdit)

        // check for changes to initial value
        if (!fieldChanged(fieldEdit)) {
          return Actions.onAttributeEditCancel({ modelName, id, fieldName })
        }

        // check for required field
        const requiredFields = this.getRequiredFields(modelName)

        if (
          !currentValue &&
          currentValue !== false &&
          R.contains(fieldName, requiredFields)
        ) {
          return Actions.onValidationErrorEdit({
            errors: makeErrorsFromMissingFields([fieldName]),
            fieldName,
            modelName,
            id
          })
        }

        return Actions.onDetailAttributeEditSubmit({
          ...payload
        })
      })
    )
  }

  [DETAIL_TABLE_EDIT_SUBMIT_CHECK](action$: any, state$: any) {
    return action$.pipe(
      ofType(DETAIL_TABLE_EDIT_SUBMIT_CHECK),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const modelName = R.prop('modelName', payload) as string
        const id = R.prop('id', payload) as string

        const changedFields = tableChangedFields({ modelName, id, state$ })

        // check for changes to initial value(s)
        if (R.isEmpty(changedFields)) {
          return Actions.onTableEditCancel({ modelName, id })
        }

        // check for required field(s)
        const requiredFields = this.getRequiredFields(modelName)
        const missingFields = requiredFields.filter(
          (fieldName: any) =>
            R.contains(fieldName, Object.keys(changedFields)) &&
            !R.prop(fieldName, changedFields) &&
            R.prop(fieldName, changedFields) !== false
        )
        if (!R.isEmpty(missingFields)) {
          return Actions.onValidationErrorTableRow({
             errors: makeErrorsFromMissingFields(missingFields),
             modelName,
             id
           })
        }

        return Actions.onDetailTableEditSubmit({
          id,
          modelName,
          changedFields,
          ...payload
        })
      })
    )
  }

  [INDEX_EDIT_SUBMIT_CHECK](action$: any, state$: any) {
    return action$.pipe(
      ofType(INDEX_EDIT_SUBMIT_CHECK),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const modelName = R.prop('modelName', payload) as any
        const id = R.prop('id', payload) as string

        const changedFields = tableChangedFields({ modelName, id, state$ })

        // check for changes to initial value(s)
        if (R.isEmpty(changedFields)) {
          return Actions.onTableEditCancel({ modelName, id })
        }

        // check for required field(s)
        const requiredFields = this.getRequiredFields(modelName)
        const missingFields = requiredFields.filter(
          (fieldName: any) =>
            R.contains(fieldName, Object.keys(changedFields)) &&
            !R.prop(fieldName, changedFields) &&
            R.prop(fieldName, changedFields) !== false
        )
        if (!R.isEmpty(missingFields)) {
          return Actions.onValidationErrorTableRow({
             errors: makeErrorsFromMissingFields(missingFields),
             modelName,
             id
           })
        }

        return Actions.onIndexEditSubmit({
          id,
          modelName,
          changedFields,
          ...payload
        })
      })
    )
  }
}
