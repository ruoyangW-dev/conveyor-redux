import * as R from 'ramda'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { isFieldTypeObject } from '@autoinvent/conveyor-schema/lib/schemaJson'

export const initState = {}

export const getEditValue = ({
  schema,
  modelName,
  fieldName,
  value
}: {
  schema: SchemaBuilder
  modelName: string
  fieldName: string
  value: any
}) => {
  const field = schema.getField(modelName, fieldName)
  const fieldType = field?.type
  if (isFieldTypeObject(fieldType)) {
    const type = fieldType.type
    const relModelName = fieldType.target ?? ''
    if (type.includes('ToMany')) {
      return value.map((node: any) => {
        const displayName = schema.getDisplayValue({
          modelName: relModelName,
          node
        })
        const id = R.prop('id', node)
        return { label: displayName, value: id }
      })
    } else if (type.includes('ToOne')) {
      if (R.isNil(value)) {
        return null
      }
      return {
        label: schema.getDisplayValue({
          modelName: relModelName,
          node: value
        }),
        value: R.prop('id', value)
      }
    } else {
      return R.prop('id', value)
    }
  } else if (fieldType === 'enum') {
    if (R.isNil(value)) {
      return null
    }
    return { label: R.path(['choices', value], field), value }
  }
  return value
}

export const selectEdit = (state: any) => R.path(['conveyor', 'edit'], state)
