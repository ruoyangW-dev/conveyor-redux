import * as R from 'ramda'
import { UPDATE_MODEL_TOOLTIP } from '../actionConsts'
import { initState } from '../utils/tooltip'
import { Reducer } from './reducer'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

/**
 * A class containing reducers handling tooltips
 */
export class TooltipReducer extends Reducer {
  /**
   * Creates a reducer object that can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   */
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }

  /**
   * Dispatched by [fetchModelTooltip](./tooltipepic.html#fetch_model_tooltip)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, id: string, data: object}}
   * @returns Update's conveyor.tooltip with tooltip data in state
   */
  [UPDATE_MODEL_TOOLTIP](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { id, modelName, data } = { ...payload }
    // @ts-ignore
    const result = R.pathOr([], ['result'], data)
    const tooltipData = []
    const fieldOrder = this.schema.schemaJSON[modelName].fieldOrder ?? []

    for (const fieldName of fieldOrder) {
      if (R.has(fieldName, result)) {
        // @ts-ignore
        const value: node = R.prop(fieldName, result)
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
                text: this.schema.getEnumLabel(modelName, fieldName, value)
              }
            ]
          })
        } else if (this.schema.isManyToMany(modelName, fieldName)) {
          const relModelName = R.path(['type', 'target'], field) as string
          // todo: add 'customProps' from outside source to all functions
          const values = value.map((node: any) => {
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
        } else if (this.schema.isManyToOne(modelName, fieldName)) {
          const relModelName = R.path(
            ['type', 'target'],
            this.schema.getField(modelName, fieldName)
          ) as string
          const text = this.schema.getDisplayValue({
            modelName: relModelName,
            node: value
          })
          const getId: (value: any) => string = R.prop('id')
          tooltipData.push({
            name,
            value: [
              {
                text,
                url: `/${relModelName}/${getId(value)}`
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
    }

    return R.assocPath([modelName, id.toString()], tooltipData, state)
  }
}
