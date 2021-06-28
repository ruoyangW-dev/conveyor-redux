import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { getActions } from './getActions'

/**
 * Here, actions are appended to the schema at the model level after
 * being bound to the redux store's 'dispatch' object. Each model receives its own separate
 * 'actions' dictionary, which one can override by editing the SchemaBuilder object.
 * Notice, the appended actions do not override already existing actions that
 * may exist in the schema 'schema.mergeDefaultModelAttr(getDefaultModelProps)'
 * as the 'override' boolean is not set to true.
 * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
 * @param dispatch Redux store's dispatch object
 */
export const mergeConveyorActions = (schema: SchemaBuilder, dispatch: any) => {
  const getDefaultModelProps = () => {
    return getActions(dispatch)
  }
  schema.mergeDefaultModelAttr(getDefaultModelProps)
}
