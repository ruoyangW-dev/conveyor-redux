import * as R from 'ramda'
import {
  initState,
  handleCreateInputChange,
  handleStackPop,
  handleClearErrorSave,
  handleStackPush,
  handleDetailCreate,
  handleEnterFormStack,
  handleValidationErrorCreate
} from '../utils/create'
import {
  CREATE_INPUT_CHANGE,
  CANCEL_CREATE,
  SAVE_CREATE_SUCCESSFUL,
  SAVE_CREATE,
  STACK_CREATE,
  DETAIL_CREATE,
  INDEX_CREATE,
  UPDATE_FORM_STACK_INDEX,
  VALIDATION_ERROR_CREATE
} from '../actionConsts'

export class CreateReducer {
  constructor(schema) {
    this.schema = schema
  }

  [CREATE_INPUT_CHANGE](state, action) {
    return handleCreateInputChange(state, action)
  }

  [CANCEL_CREATE](state) {
    return handleStackPop(state)
  }

  [SAVE_CREATE_SUCCESSFUL](state) {
    return handleStackPop(state)
  }

  [SAVE_CREATE](state) {
    return handleClearErrorSave(state)
  }

  [STACK_CREATE](state, action) {
    return handleStackPush(state, action)
  }

  [DETAIL_CREATE](state, action) {
    return handleDetailCreate(this.schema, state, action)
  }

  [INDEX_CREATE](state, action) {
    return handleEnterFormStack(state, action)
  }

  [UPDATE_FORM_STACK_INDEX](state, action) {
    return R.assoc('index', R.path(['payload', 'index'], action), state)
  }

  [VALIDATION_ERROR_CREATE](state, action) {
    return handleValidationErrorCreate(state, action)
  }

  reduce(state = initState, action) {
    if (this && R.type(this[action.type]) === 'Function')
      return this[action.type](state, action)
    else return state
  }
}
