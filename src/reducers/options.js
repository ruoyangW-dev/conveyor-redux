import * as Actions from '../actionConsts'
import * as R from 'ramda'
import { getDisplayValue, getField } from 'conveyor'

const initState = {}

export const generateOptionsReducer = schema => (state = initState, action) => {
  const payload = action.payload
  const fieldName = R.prop('fieldName', action)
  const modelName = R.prop('modelName', payload)
  const value = R.prop('value', payload)

  switch (action.type) {
    case Actions.MENU_OPEN: {
      const { modelName, fieldName, rawData } = { ...payload }

      // get schema data about the field
      const field1 = getField(schema, modelName, fieldName)

      // get the target model from the field:
      const targetModel = R.path(['type', 'target'], field1)

      // get drop-down options
      const options = rawData.map(node => ({
        label: getDisplayValue({ schema, modelName: targetModel, node }),
        value: R.prop('id', node)
      }))

      return R.assocPath([modelName, fieldName], options, state)
    }
    case Actions.DATA_OPTIONS_UPDATE: {
      const targetModelName = R.path(
        ['type', 'target'],
        getField(schema, modelName, fieldName)
      )
      const options = value.map(option => ({
        label: getDisplayValue({
          schema,
          modelName: targetModelName,
          node: option
        }),
        value: R.prop('id', option)
      }))

      return R.assocPath([modelName, fieldName], options, state)
    }
    case Actions.EXISTING_VALUE_UPDATE: {
      const options = value.map(option => ({ label: option, value: option }))

      return R.assocPath([modelName, fieldName], options, state)
    }

    default:
      return state
  }
}

export const selectOptions = state => R.prop('options', state)
