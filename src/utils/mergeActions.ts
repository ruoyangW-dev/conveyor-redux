import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { getActions } from './getActions'

export const mergeConveyorActions = (schema: SchemaBuilder, dispatch: any) => {
  const getDefaultModelProps = ({
    schema,
    model
  }: {
    schema: any
    model: any
  }) => {
    return getActions(dispatch)
  }
  schema.mergeDefaultModelAttr(getDefaultModelProps, true)
}