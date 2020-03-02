import * as R from 'ramda'
import { UPDATE_MODEL_TOOLTIP } from '../actionConsts'
import {
  getDisplayValue,
  getField,
  getFieldLabel,
  getType,
  getEnumLabel,
  inputTypes
} from '@autoinvent/conveyor'
import { initState } from '../utils/tooltip'

export class TooltipReducer {
  constructor(schema) {
    this.schema = schema
  }

  [UPDATE_MODEL_TOOLTIP](state, action) {
    const payload = R.prop('payload', action)
    const { id, modelName, data } = { ...payload }
    const result = R.prop('result', data)
    const tooltipData = []

    for (const fieldName in result) {
      const value = R.prop(fieldName, result)
      const name = getFieldLabel({ schema: this.schema, modelName, fieldName })
      const type = getType({ schema: this.schema, modelName, fieldName })
      const field = getField(this.schema, modelName, fieldName)

      if (value === null) {
        tooltipData.push({
          name,
          value: [
            {
              text: 'N/A'
            }
          ]
        })
      } else if (type === 'enum') {
        tooltipData.push({
          name,
          value: [
            {
              text: getEnumLabel({
                schema: this.schema,
                modelName,
                fieldName,
                value
              })
            }
          ]
        })
      } else if (
        getType({ schema: this.schema, modelName, fieldName }) ===
        inputTypes.MANY_TO_MANY_TYPE
      ) {
        const relModelName = R.path(['type', 'target'], field)
        const values = value.map(node => {
          const text = getDisplayValue({
            schema: this.schema,
            modelName: relModelName,
            node
          })

          return {
            text,
            url: `/${relModelName}/${R.prop('id', node)}`
          }
        })
        tooltipData.push({
          name,
          value: values
        })
      } else if (
        getType({ schema: this.schema, modelName, fieldName }) ===
        inputTypes.MANY_TO_ONE_TYPE
      ) {
        const relModelName = R.path(
          ['type', 'target'],
          getField(this.schema, modelName, fieldName)
        )
        const text = getDisplayValue({
          schema: this.schema,
          modelName: relModelName,
          node: value
        })
        tooltipData.push({
          name,
          value: [
            {
              text,
              url: `/${relModelName}/${R.prop('id', value)}`
            }
          ]
        })
      } else {
        tooltipData.push({
          name,
          value: [
            {
              text: value
            }
          ]
        })
      }
    }

    return R.assocPath([modelName, id.toString()], tooltipData, state)
  }

  reduce(state = initState, action) {
    if (this && R.type(this[action.type]) === 'Function')
      return this[action.type](state, action)
    else return state
  }
}
