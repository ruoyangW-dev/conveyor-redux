import * as Actions from '../actionConsts'
import * as R from 'ramda'
import { getDisplayValue, getField } from 'conveyor'

const initState = {}

export const generateOptionsReducer = (schema) => (state = initState, action) => {
  const payload = action.payload
  switch (action.type) {
    case Actions.MENU_OPEN: {
      const { modelName, fieldName, rawData } = { ...payload }

      // get schema data about the field
      const field1 = getField(schema, modelName, fieldName)

      // get the target model from the field:
      const targetModel = R.path(['type', 'target'], field1)

      // get drop-down options
      const options = rawData.map(node => ({ label: getDisplayValue({ schema, modelName: targetModel, node }), value: R.prop('id', node) }))

      return R.assocPath([modelName, fieldName], options, state)
    }

    default:
      return state
  }
}

export const selectOptions = state => R.prop('options', state)
