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
import { getRequiredFields } from '@autoinvent/conveyor'
import { Epic } from './epic'

export class ValidationEpic extends Epic {
  [SAVE_CREATE_CHECK](action$, state$) {
    return action$.pipe(
      ofType(SAVE_CREATE_CHECK),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const stack = R.path(['value', 'conveyor', 'create', 'stack'], state$)
        const fields = R.path([stack.length - 1, 'fields'], stack)
        const requiredFields = R.filter(
          val => val !== 'id',
          getRequiredFields(this.schema, modelName)
        )
        const missingFields = requiredFields.filter(
          fieldName => !(fieldName in fields)
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

  [DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK](action$, state$) {
    return action$.pipe(
      ofType(DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const fieldName = R.prop('fieldName', payload)
        const id = R.prop('id', payload)
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
          val => val !== 'id',
          getRequiredFields(this.schema, modelName)
        )
        if (!currentValue && R.contains(fieldName, requiredFields)) {
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

  [DETAIL_TABLE_EDIT_SUBMIT_CHECK](action$, state$) {
    return action$.pipe(
      ofType(DETAIL_TABLE_EDIT_SUBMIT_CHECK),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const id = R.prop('id', payload)

        const changedFields = tableChangedFields({ modelName, id, state$ })

        // check for changes to initial value(s)
        if (R.isEmpty(changedFields)) {
          return Actions.onTableEditCancel({ modelName, id })
        }

        // check for required field(s)
        const requiredFields = R.filter(
          val => val !== 'id',
          getRequiredFields(this.schema, modelName)
        )
        const missingFields = requiredFields.filter(
          fieldName =>
            R.contains(fieldName, Object.keys(changedFields)) &&
            !R.prop(fieldName, changedFields)
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

  [INDEX_EDIT_SUBMIT_CHECK](action$, state$) {
    return action$.pipe(
      ofType(INDEX_EDIT_SUBMIT_CHECK),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const id = R.prop('id', payload)

        const changedFields = tableChangedFields({ modelName, id, state$ })

        // check for changes to initial value(s)
        if (R.isEmpty(changedFields)) {
          return Actions.onTableEditCancel({ modelName, id })
        }

        // check for required field(s)
        const requiredFields = R.filter(
          val => val !== 'id',
          getRequiredFields(this.schema, modelName)
        )
        const missingFields = requiredFields.filter(
          fieldName =>
            R.contains(fieldName, Object.keys(changedFields)) &&
            !R.prop(fieldName, changedFields)
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
