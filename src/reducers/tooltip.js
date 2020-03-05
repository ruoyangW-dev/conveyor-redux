import * as R from 'ramda'
import { UPDATE_MODEL_TOOLTIP } from '../actionConsts'
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
      // todo: add 'node' and/or 'data' props into 'schema.getFieldLabel'
      const name = this.schema.getFieldLabel({ modelName, fieldName })
      const type = this.schema.getType(modelName, fieldName)
      const field = this.schema.getField(modelName, fieldName)

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
              text: this.schema.getEnumLabel(
                modelName,
                fieldName,
                value
              )
            }
          ]
        })
      } else if (
        this.schema.isManyToMany(modelName, fieldName)
      ) {
        const relModelName = R.path(['type', 'target'], field)
        // todo: add 'customProps' from outside source to all functions
        const values = value.map(node => {
          const text = this.schema.getDisplayValue({
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
        this.schema.isManyToOne(modelName, fieldName)
      ) {
        const relModelName = R.path(
          ['type', 'target'],
          this.schema.getField(modelName, fieldName)
        )
        const text = this.schema.getDisplayValue({
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
