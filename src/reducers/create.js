import * as R from 'ramda'
import * as Actions from '../actionConsts'
import { getDisplayValue, getType, getFields } from 'conveyor'

const initState = {
  index: -1,
  stack: []
}

const stackPush = (state, action) => {
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

const enterFormStack = (state, action) => {
  // clear the state
  state = initState

  // get path where user originated before entering form stack
  const originPath = R.path(['payload', 'path'], action)
  // push new value to stack
  state = stackPush(state, action)
  return R.assoc('originPath', originPath, state)
}

// enter create stack from parent obj. detail page
const detailCreate = (schema, state, action) => {
  const payload = R.prop('payload', action)
  const node = R.prop('node', payload)

  // since the create stack is entered from another object's detail page (parent object)
  // we must autopopulate the value of the related field (this is optional)
  // to do so, we must get the field name that the parent object is called on the
  // model we are creating, 'targetInverseFieldName'
  const targetInverseFieldName = R.prop('targetInverseFieldName', payload)

  // then we get the modelName of the parent detail page we originated from
  const parentModelName = R.pipe(
    R.prop('path'),
    R.split('/'),
    R.nth(1)
  )(payload)

  // what the parent object instance is called
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
  // prepopulated field may have to take the form of a list if it is a 'ToMany' field
  const prepopulatedField = type.includes('ToMany') ? [fieldData] : fieldData

  // add prepopulated field to the state, so that upon opening the create form
  // it will already be visible
  state = R.assocPath(
    ['stack', 0, 'fields', targetInverseFieldName],
    prepopulatedField,
    enterFormStack(state, action)
  )
  // add originModelName/ originFieldName so that, when user exists for stack, the app will redirect
  // back where you came from (parent detail page)
  state = R.assoc('originModelName', parentModelName, state)
  state = R.assoc('originFieldName', targetInverseFieldName, state)
  // allows you to create the field label for the prepopulated parent field
  return R.assoc('originData', node, state)
}

const CreateValues = (schema, { modelName, state }) => {
  // get fields that should be create-able
  const createFields = R.filter(
    field => R.prop('showCreate', field),
    getFields(schema, modelName)
  )

  // get index of form stack being saved
  const formStackIndex = R.prop('index', state)

  // get origin page, if create stack entered from detail page
  const originModelName = R.prop('originModelName', state)

  // if created from detail page, auto-fill origin page with field data
  if (originModelName && formStackIndex === 0) {
    const originFieldName = R.prop('originFieldName', state)
    createFields[originFieldName] = originFieldName
  }

  // get inputs from state, according to 'showCreate' in schema
  return Object.assign(
    {},
    ...Object.entries(createFields).map(([fieldName, field]) => ({
      [fieldName]: R.path(['stack', formStackIndex, 'fields', fieldName], state)
    }))
  )
}

const stackPop = state => {
  const stack = R.prop('stack', state)
  // pop latest entry from formStack and change index
  stack.pop()
  const newIndex = R.prop('index', state) - 1
  state = R.assoc('stack', stack, state)
  return R.assoc('index', newIndex, state)
}

const handleStackPop = (state, action) => {
  const stack = R.prop('stack', state)
  stack.pop()
  const newIndex = R.prop('index', state) - 1
  state = R.assoc('stack', stack, state)
  state = R.assoc('index', newIndex, state)
  return state
}

export const generateCreateReducer = schema => (state = initState, action) => {
  const payload = action.payload
  switch (action.type) {
    case Actions.INPUT_CHANGE: {
      const currentIndex = R.prop('index', state)
      return R.assocPath(
        ['stack', currentIndex, 'fields', payload.fieldName],
        payload.value,
        state
      )
    }
    case Actions.CANCEL: {
      // pop the latest form off the stack
      return stackPop(state)
    }
    case Actions.SAVE: {
      const modelName = R.prop('modelName', payload)
      // use rawCreateValues to add to database
      const rawCreateValues = CreateValues(schema, { modelName, state })
      console.log('SAVE CREATE', rawCreateValues)
      // after successful save, call 'CANCEL' action
      return state
    }
    case Actions.SAVE_SUCCESSFUL: {
      return handleStackPop(state, action)
    }
    case Actions.STACK_CREATE: {
      return stackPush(state, action)
    }
    case Actions.DETAIL_CREATE: {
      return detailCreate(schema, state, action)
    }
    case Actions.INDEX_CREATE: {
      return enterFormStack(state, action)
    }
    case Actions.BREADCRUMB_CLICK: {
      return R.assoc('index', R.path(['payload', 'index'], action), state)
    }

    default:
      return state
  }
}

export const selectCreate = state => R.prop('create', state)
