import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import * as consts from '../actionConsts'
import * as R from 'ramda'
import * as Actions from '../actions'

const tableChangedFields = ({ modelName, id, state$ }) =>
  R.pipe(
    R.path(['value', 'conveyor', 'edit', modelName, id]),
    R.filter(
      val => !R.equals(R.prop('currentValue', val), R.prop('initialValue', val))
    ),
    R.map(field => R.prop('currentValue', field))
  )(state$)

const getMissingFieldsMessage = ({ schema, missingFields, modelName }) =>
  R.reduce(
    (acc, fieldName) =>
      // todo add 'node' and 'data' props
      acc + schema.getFieldLabel({ modelName, fieldName }) + ', ',
    '',
    missingFields
  ).slice(0, -2)

export const generateSaveCreateCheckEpic = schema => (action$, state$) =>
  action$.pipe(
    ofType(consts.SAVE_CREATE_CHECK),
    map(R.prop('payload')),
    map(payload => {
      const modelName = R.prop('modelName', payload)
      const stack = R.path(['value', 'conveyor', 'create', 'stack'], state$)
      const fields = R.path([stack.length - 1, 'fields'], stack)
      const requiredFields = R.filter(
        val => val !== 'id',
        schema.getRequiredFields(modelName)
      )
      const missingFields = requiredFields.filter(
        fieldName => !(fieldName in fields)
      )

      if (!R.isEmpty(missingFields)) {
        const message = getMissingFieldsMessage({
          schema,
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

export const generateDetailAttributeEditSubmitCheckEpic = schema => (
  action$,
  state$
) =>
  action$.pipe(
    ofType(consts.DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK),
    map(R.prop('payload')),
    map(payload => {
      const modelName = R.prop('modelName', payload)
      const fieldName = R.prop('fieldName', payload)
      const id = R.prop('id', payload)
      const currentValue = R.path(
        ['value', 'conveyor', 'edit', modelName, id, fieldName, 'currentValue'],
        state$
      )
      const initialValue = R.path(
        ['value', 'conveyor', 'edit', modelName, id, fieldName, 'initialValue'],
        state$
      )

      // check for changes to initial value
      if (R.equals(currentValue, initialValue)) {
        return Actions.onAttributeEditCancel({ modelName, id, fieldName })
      }

      // check for required field
      const requiredFields = R.filter(
        val => val !== 'id',
        schema.getRequiredFields(modelName)
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

export const generateDetailTableEditSubmitCheckEpic = schema => (
  action$,
  state$
) =>
  action$.pipe(
    ofType(consts.DETAIL_TABLE_EDIT_SUBMIT_CHECK),
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
        schema.getRequiredFields(modelName)
      )
      const missingFields = requiredFields.filter(
        fieldName =>
          R.contains(fieldName, Object.keys(changedFields)) &&
          !R.prop(fieldName, changedFields)
      )
      if (!R.isEmpty(missingFields)) {
        const message = getMissingFieldsMessage({
          schema,
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

export const generateIndexEditSubmitCheckEpic = schema => (action$, state$) =>
  action$.pipe(
    ofType(consts.INDEX_EDIT_SUBMIT_CHECK),
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
        schema.getRequiredFields(modelName)
      )
      const missingFields = requiredFields.filter(
        fieldName =>
          R.contains(fieldName, Object.keys(changedFields)) &&
          !R.prop(fieldName, changedFields)
      )
      if (!R.isEmpty(missingFields)) {
        const message = getMissingFieldsMessage({
          schema,
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
