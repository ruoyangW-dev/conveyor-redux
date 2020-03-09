import * as R from 'ramda'
import {
  MENU_OPEN,
  DATA_OPTIONS_UPDATE,
  EXISTING_VALUE_UPDATE
} from '../actionConsts'
import { initState } from '../utils/options'

export class OptionsReducer {
  constructor(schema) {
    this.schema = schema
  }

  [MENU_OPEN](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, rawData } = { ...payload }

    // get schema data about the field
    const field1 = this.schema.getField(modelName, fieldName)

    // get the target model from the field:
    const targetModel = R.path(['type', 'target'], field1)

    // get drop-down options
    const options = rawData.map(node => ({
      label: this.schema.getDisplayValue({
        modelName: targetModel,
        node
      }),
      value: R.prop('id', node)
    }))

    return R.assocPath([modelName, fieldName], options, state)
  }

  [DATA_OPTIONS_UPDATE](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, value } = { ...payload }
    const targetModelName = R.path(
      ['type', 'target'],
      this.schema.getField(modelName, fieldName)
    )
    const options = value.map(option => ({
      label: this.schema.getDisplayValue({
        modelName: targetModelName,
        node: option
      }),
      value: R.prop('id', option)
    }))

    return R.assocPath([modelName, fieldName], options, state)
  }

  [EXISTING_VALUE_UPDATE](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, value } = { ...payload }
    const options = value.map(option => ({ label: option, value: option }))

    return R.assocPath([modelName, fieldName], options, state)
  }

  reduce(state = initState, action) {
    if (this && R.type(this[action.type]) === 'Function')
      return this[action.type](state, action)
    else return state
  }
}
