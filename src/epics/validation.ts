import * as R from 'ramda'
import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import {
  SAVE_CREATE_CHECK,
  DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK,
  DETAIL_TABLE_EDIT_SUBMIT_CHECK,
  INDEX_EDIT_SUBMIT_CHECK
} from '../actionConsts'
import { getMissingFieldsMessage, tableChangedFields } from '../utils/helpers'
import * as Actions from '../actions'
import { Epic } from './epic'
import { EpicPayload } from '../types'

/**
 * A class containing epics handling validation.
 */
export class ValidationEpic extends Epic {
  /**
   * Dispatched after creating a model instance for a relation field on Create page.
   * @param action$ object {type: string, payload: {modelName: author}}
   * @param state$ Redux state
   * @returns - Actions.[onSaveCreate](./createepic.html#save_create)({...payload})
   */
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
        const requiredFields = R.filter(
          (val) => val !== 'id',
          this.schema.getRequiredFields(modelName)
        )
        const missingFields = requiredFields.filter(
          (fieldName: any) => !(fieldName in fields)
        )

        if (!R.isEmpty(missingFields)) {
          const message = getMissingFieldsMessage({
            schema: this.schema,
            missingFields,
            modelName
          })
          return Actions.addDangerAlert({
            message: `Missing required field(s): ${message}`
          })
        } else {
          return Actions.onSaveCreate({ ...payload })
        }
      })
    )
  }

  /**
   * Dispatched after saving an edited attribute on Detail page. \
   * Checks whether the current and initial value are different.
   * @param action$ object {type: string, payload: {modelName: string, fieldName: string, id: string}}
   * @param state$ Redux state
   * @returns - Actions.[onAttributeEditCancel](./editreducer.html#attribute_edit_cancel)({modelName: string, id: string, fieldName: string}) (if initial value equals current value), \
   *  Actions.[onDetailAttributeEditSubmit](./editepic.html#detail_attribute_edit_submit)({...payload}) (if initial value differs from current value)
   */
  [DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK](action$: any, state$: any) {
    return action$.pipe(
      ofType(DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const modelName = R.prop('modelName', payload) as string
        const fieldName = R.prop('fieldName', payload) as string
        const id = R.prop('id', payload) as string
        const currentValue = R.path(
          [
            'value',
            'conveyor',
            'edit',
            modelName,
            id,
            fieldName,
            'currentValue'
          ],
          state$
        )
        const initialValue = R.path(
          [
            'value',
            'conveyor',
            'edit',
            modelName,
            id,
            fieldName,
            'initialValue'
          ],
          state$
        )

        // check for changes to initial value
        if (R.equals(currentValue, initialValue)) {
          return Actions.onAttributeEditCancel({ modelName, id, fieldName })
        }

        // check for required field
        const requiredFields = R.filter(
          (val) => val !== 'id',
          this.schema.getRequiredFields(modelName)
        )
        if (
          !currentValue &&
          currentValue !== false &&
          R.contains(fieldName, requiredFields)
        ) {
          return Actions.addDangerAlert({
            message: `Missing required field: ${fieldName}.`
          })
        }

        return Actions.onDetailAttributeEditSubmit({
          ...payload
        })
      })
    )
  }

  /**
   * Dispatched when saving an edited relation field on Detail page.
   * @param action$ object {type: string, payload: {parentModelName: string, parentId: string, modelName: string, id: string}}
   * @param state$ Redux state
   * @returns - Actions.[onDetailTableEditSubmit](./editepic.html#detail_table_edit_submit)({id: string, modelName: string, changedFields: object, ...payload})
   */
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
        const requiredFields = R.filter(
          (val) => val !== 'id',
          this.schema.getRequiredFields(modelName)
        )
        const missingFields = requiredFields.filter(
          (fieldName: any) =>
            R.contains(fieldName, Object.keys(changedFields)) &&
            !R.prop(fieldName, changedFields) &&
            R.prop(fieldName, changedFields) !== false
        )
        if (!R.isEmpty(missingFields)) {
          const message = getMissingFieldsMessage({
            schema: this.schema,
            missingFields,
            modelName
          })
          return Actions.addDangerAlert({
            message: `Missing required field(s): ${message}.`
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

  /**
   * Called after saving edits on an instance on the Index page.
   * @param action$ object {type: string, payload: {modelName: string, id: string}}
   * @param state$ Redux state
   * @returns - Actions.[onTableEditCancel](./editreducer.html#table_edit_cancel)({modelName: string, id: string}) (if no fields were edited) \
   *  Actions.[onIndexEditSubmit](./editepic.html#index_edit_submit)({id: string, modelName: string, changedFields: object, ...payload}) (if any fields were edited)
   */
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
        const requiredFields = R.filter(
          (val) => val !== 'id',
          this.schema.getRequiredFields(modelName)
        )
        const missingFields = requiredFields.filter(
          (fieldName: any) =>
            R.contains(fieldName, Object.keys(changedFields)) &&
            !R.prop(fieldName, changedFields) &&
            R.prop(fieldName, changedFields) !== false
        )
        if (!R.isEmpty(missingFields)) {
          const message = getMissingFieldsMessage({
            schema: this.schema,
            missingFields,
            modelName
          })
          return Actions.addDangerAlert({
            message: `Missing required field(s): ${message}.`
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
