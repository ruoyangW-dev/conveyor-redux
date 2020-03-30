import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { getActions } from './getActions'

export const mergeConveyorActions = (schema: SchemaBuilder, dispatch: any) => {
  /* Here, actions are appended to the schema at the model level after
  * being bound to the redux store's 'dispatch' object. Each model receives its own separate
  * 'actions' dictionary, which one can override by editing the SchemaBuilder object.
  * Notice, the appended actions do not override already existing actions that
  * may exist in the schema 'schema.mergeDefaultModelAttr(getDefaultModelProps)'
  * as the 'override' boolean is not set to true.*/

  const getDefaultModelProps = ({
    schema,
    model
  }: {
    schema: any
    model: any
  }) => {
    return getActions(dispatch)
  }
  schema.mergeDefaultModelAttr(getDefaultModelProps)
}