import * as R from 'ramda'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

export const initState = {
  index: -1,
  stack: []
}

export const handleStackPop = (state: any) => {
  const stack = R.prop('stack', state)
  stack.pop()
  const newIndex = R.prop('index', state) - 1
  state = R.assoc('stack', stack, state)
  return R.assoc('index', newIndex, state)
}

export const handleStackPush = (state: any, action: any) => {
  const stack = R.prop('stack', state)
  const newIndex = R.prop('index', state) + 1
  state = R.assoc(
    'stack',
    R.append({ modelName: R.path(['payload', 'modelName'], action) }, stack),
    state
  )
  state = R.assoc('index', newIndex, state)
  return R.assocPath(['stack', newIndex, 'fields'], {}, state)
}

export const clearFormStack = () => {
  return initState
}

export const handleEnterFormStack = (state: any, action: any) => {
  state = clearFormStack()
  const originPath = R.path(['payload', 'path'], action)
  state = handleStackPush(state, action)
  return R.assoc('originPath', originPath, state)
}

export const handleDetailCreate = (
  schema: SchemaBuilder,
  state: any,
  action: any
) => {
  const payload = R.prop('payload', action)
  const node = R.prop('node', payload)
  const targetInverseFieldName = R.prop('targetInverseFieldName', payload)
  const parentModelName = R.pipe(
    // @ts-ignore
    R.prop('path'),
    R.split('/'),
    R.nth(1)
  )(payload)
  const parentName = schema.getDisplayValue({
    modelName: parentModelName,
    node
  })
  const parentId = R.prop('id', node)

  const type = schema.getType(
    R.path(['payload', 'modelName'], action) as string,
    targetInverseFieldName
  )
  const fieldData = {
    label: parentName,
    value: parentId,
    disabled: true
  }
  const prepopulatedField = type.includes('ToMany') ? [fieldData] : fieldData
  state = R.assocPath(
    ['stack', 0, 'fields', targetInverseFieldName],
    prepopulatedField,
    handleEnterFormStack(state, action)
  )
  state = R.assoc('originModelName', parentModelName, state)
  state = R.assoc('originFieldName', targetInverseFieldName, state)
  return R.assoc('originNode', node, state)
}

export const handleCreateInputChange = (state: any, action: any) => {
  const currentIndex = R.prop('index', state)
  const payload = R.prop('payload', action)
  return R.assocPath(
    ['stack', currentIndex, 'fields', payload.fieldName],
    payload.value,
    state
  )
}

export const handleValidationErrorCreate = (state: any, action: any) => {
  const payload = R.prop('payload', action)
  const stackIndex = R.prop('index', state)
  const errors: any[] = R.propOr([], 'errors', payload)

  R.forEach(fieldNameError => {
    state = R.assocPath(
      R.prop(fieldNameError as any, errors),
      ['stack', stackIndex, 'errors', fieldNameError],
      state
    )
  }, Object.keys(errors))
  return state
}

export const handleClearErrorSave = (state: any) => {
  return R.dissocPath(['stack', R.prop('index', state), 'errors'], state)
}

export const selectCreate = (state: any) =>
  R.pathOr(initState, ['conveyor', 'create'], state)
