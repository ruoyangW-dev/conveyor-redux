import * as R from 'ramda'
import * as Actions from '../actionConsts'
import { getDisplayValue, getField } from 'conveyor'
import { LOCATION_CHANGE } from 'connected-react-router'

const initState = {}

const getEditValue = (schema, { modelName, fieldName, value }) => {
  const field = getField(schema, modelName, fieldName)
  const fieldType = R.prop('type', field)
  if (R.type(fieldType) === 'Object') {
    const type = R.prop('type', fieldType)
    const relModelName = R.prop('target', fieldType)
    if (type.includes('ToMany')) {
      return value.map(node => {
        const displayName = getDisplayValue({
          schema,
          modelName: relModelName,
          node
        })
        const id = R.prop('id', node)
        return { label: displayName, value: id }
      })
    } else if (type.includes('ToOne')) {
      if (R.isNil(value)) {
        return null
      }
      return {
        label: getDisplayValue({
          schema,
          modelName: relModelName,
          node: value
        }),
        value: R.prop('id', value)
      }
    } else {
      return R.prop('id', value)
    }
  } else if (fieldType === 'enum') {
    if (R.isNil(value)) {
      return null
    }
    return { label: R.path(['choices', value], field), value }
  }
  return value
}

export const generateEditReducer = schema => (state = initState, action) => {
  const payload = action.payload
  switch (action.type) {
    case LOCATION_CHANGE:
      return initState
    case Actions.TABLE_ROW_EDIT: {
      const { modelName, id, node } = { ...payload }
      const nodeFlattened = R.mapObjIndexed((value, fieldName) => {
        const editValue = getEditValue(schema, { modelName, fieldName, value })
        return {
          currentValue: editValue,
          initialValue: editValue
        }
      }, node)
      // if id is int, assocPath() creates list instead of object
      return R.assocPath([modelName, id.toString()], nodeFlattened, state)
    }
    case Actions.ATTRIBUTE_EDIT: {
      const { modelName, id, fieldName, value } = { ...payload }
      const editValue = getEditValue(schema, { modelName, fieldName, value })
      const editState = {
        initialValue: editValue,
        currentValue: editValue
      }
      return R.assocPath(
        [modelName, id.toString(), fieldName],
        editState,
        state
      )
    }
    case Actions.TABLE_EDIT_CANCEL: {
      const { modelName, id } = { ...payload }
      state = R.dissocPath([modelName, id], state)

      // if no ids for model are being edited, remove the model from the edit store
      if (R.isEmpty(R.prop(modelName, state))) {
        return R.dissoc(modelName, state)
      }
      return state
    }
    case Actions.ATTRIBUTE_EDIT_CANCEL: {
      const { modelName, fieldName, id } = { ...payload }

      // Remove the field from the edit store
      state = R.dissocPath([modelName, id, fieldName], state)

      // if the instance of the model has no fields being edited, remove it from the store
      if (R.isEmpty(R.path([modelName, id], state))) {
        state = R.dissocPath([modelName, id], state)
      }

      // if no instances of the model are being edited, remove the model from the edit store
      if (R.isEmpty(R.prop(modelName, state))) {
        state = R.dissoc(modelName, state)
      }
      return state
    }
    case Actions.VALIDATION_ERROR_EDIT: {
      const { modelName, id, fieldName, errors } = { ...payload }
      R.forEach(fieldNameError => {
        if (fieldNameError === fieldName) {
          state = R.assocPath(
            [modelName, id.toString(), fieldNameError, 'errors'],
            R.prop(fieldNameError, errors),
            state
          )
        }
      }, Object.keys(errors))
      return state
    }
    case Actions.DETAIL_TABLE_EDIT_SUBMIT: {
      const { modelName, id } = { ...payload }
      const fields = Object.keys(R.path([modelName, id], state))
      R.forEach(f => {
        state = R.dissocPath(R.concat([modelName, id], [f, 'errors']), state)
      }, fields)
      return state
    }
    case Actions.DETAIL_ATTRIBUTE_EDIT_SUBMIT: {
      const { modelName, id, fieldName } = { ...payload }
      return R.dissocPath([modelName, id, fieldName, 'errors'], state)
    }
    case Actions.EDIT_INPUT_CHANGE: {
      const { modelName, id, fieldName, value } = { ...payload }

      return R.assocPath(
        [modelName, id.toString(), fieldName, 'currentValue'],
        value,
        state
      )
    }
    case Actions.VALIDATION_ERROR_TABLE_ROW: {
      const { modelName, id, errors } = { ...payload }
      R.forEach(fieldNameError => {
        state = R.assocPath(
          [modelName, id.toString(), fieldNameError, 'errors'],
          R.prop(fieldNameError, errors),
          state
        )
      }, Object.keys(errors))
      return state
    }

    default:
      return state
  }
}

export const selectEdit = state => R.prop('edit', state)
