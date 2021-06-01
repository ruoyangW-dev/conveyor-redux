import * as R from 'ramda'
import {
  MENU_OPEN,
  DATA_OPTIONS_UPDATE,
  EXISTING_VALUE_UPDATE
} from '../actionConsts'
import { initState } from '../utils/options'
import { Reducer } from './reducer'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Config } from '../types'

/**
 * Class of reducers handling options
 */
export class OptionsReducer extends Reducer {
  /**
   * Creates a reducer object that can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   * @param config Custom user inputted configurations
   */
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }

  /**
   * Dispatched when opening a menu for a user-defined field
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, rawData: object}}
   * @returns Updates conveyor.options.modelName.fieldName with provided data in state
   */
  [MENU_OPEN](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName, rawData } = { ...payload }

    // get schema data about the field
    const field1 = this.schema.getField(modelName, fieldName)

    // get the target model from the field:
    const targetModel = R.path(['type', 'target'], field1) as string

    // get drop-down options
    const options = rawData.map((node: any) => ({
      label: this.schema.getDisplayValue({
        modelName: targetModel,
        node
      }),
      value: R.prop('id', node)
    }))

    return R.assocPath([modelName, fieldName], options, state)
  }

  /**
   * Called by [relationshipSelectMenuOpen](./optionsepic.html#relationship_select_menu_open)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, data: object}}
   * @returns Updates conveyor.options.parentModelName.fieldName with selectable options in state
   */
  [DATA_OPTIONS_UPDATE](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName } = { ...payload }
    const targetModelName = R.path(
      ['type', 'target'],
      this.schema.getField(modelName, fieldName)
    ) as any
    const data = R.path(['data', 'result'], payload) as any
    const options = data.map((option: any) => ({
      label: this.schema.getDisplayValue({
        modelName: targetModelName,
        node: option
      }),
      value: R.prop('id', option)
    }))

    return R.assocPath([modelName, fieldName], options, state)
  }

  /**
   * Called by [querySelectMenuOpen](./optionsepic.html#query_select_menu_open)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string}, value: []}
   * @returns Updates conveyor.options.modelName.fieldName with existing values in state
   */
  [EXISTING_VALUE_UPDATE](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName, value } = { ...payload }
    const options = value.map((option: any) => ({
      label: option,
      value: option
    }))

    return R.assocPath([modelName, fieldName], options, state)
  }
}
