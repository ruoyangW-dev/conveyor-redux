import * as R from 'ramda'
import * as Actions from '../actionConsts'
import { getDisplayValue, getType } from 'conveyor'

const initState = {
  index: -1,
  stack: []
}

const handleStackPop = state => {
  const stack = R.prop('stack', state)
  stack.pop()
  const newIndex = R.prop('index', state) - 1
  state = R.assoc('stack', stack, state)
  return R.assoc('index', newIndex, state)
}

const handleStackPush = (state, action) => {
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

const handleEnterFormStack = (state, action) => {
  state = clearFormStack()
  const originPath = R.path(['payload', 'path'], action)
  state = handleStackPush(state, action)
  return R.assoc('originPath', originPath, state)
}

const handleDetailCreate = (schema, state, action) => {
  const payload = R.prop('payload', action)
  const node = R.prop('node', payload)
  const targetInverseFieldName = R.prop('targetInverseFieldName', payload)
  const parentModelName = R.pipe(
    R.prop('path'),
    R.split('/'),
    R.nth(1)
  )(payload)
  const parentName = getDisplayValue({
    schema,
    modelName: parentModelName,
    node
  })
  const parentId = R.prop('id', node)

  const type = getType({
    schema,
    modelName: R.path(['payload', 'modelName'], action),
    fieldName: targetInverseFieldName
  })
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

const handleCreateInputChange = (state, action) => {
  const currentIndex = R.prop('index', state)
  const payload = R.prop('payload', action)
  return R.assocPath(
    ['stack', currentIndex, 'fields', payload.fieldName],
    payload.value,
    state
  )
}

const handleValidationErrorCreate = (state, action) => {
  const payload = R.prop('payload', action)
  const stackIndex = R.prop('index', state)
  const errors = R.propOr([], 'errors', payload)

  R.forEach(fieldNameError => {
    state = R.assocPath(
      R.prop(fieldNameError, errors),
      ['stack', stackIndex, 'errors', fieldNameError],
      state
    )
  }, Object.keys(errors))
  return state
}

const handleClearErrorSave = state => {
  return R.dissocPath(['stack', R.prop('index', state), 'errors'], state)
}

export const generateCreateReducer = ({ schema, customActions = {} }) => (
  state = initState,
  action
) => {
  if (R.has(action.type, customActions)) {
    return customActions[action.type](state)
  }

  switch (action.type) {
    case Actions.CREATE_INPUT_CHANGE:
      return handleCreateInputChange(state, action)
    case Actions.CANCEL_CREATE:
    case Actions.SAVE_CREATE_SUCCESSFUL:
      return handleStackPop(state)
    case Actions.SAVE_CREATE:
      return handleClearErrorSave(state)
    case Actions.STACK_CREATE:
      return handleStackPush(state, action)
    case Actions.DETAIL_CREATE:
      return handleDetailCreate(schema, state, action)
    case Actions.INDEX_CREATE:
      return handleEnterFormStack(state, action)
    case Actions.UPDATE_FORM_STACK_INDEX:
      return R.assoc('index', R.path(['payload', 'index'], action), state)
    case Actions.VALIDATION_ERROR_CREATE:
      return handleValidationErrorCreate(state, action)

    default:
      return state
  }
}

export const selectCreate = state => R.propOr(initState, 'create', state)
