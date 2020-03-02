import * as R from 'ramda'
import { UPDATE_DELETE_DETAIL, CANCEL_DELETE_DETAIL } from '../actionConsts'
import { initState, groupModels } from '../utils/modal'

export class ModalReducer {
  constructor(schema) {
    this.schema = schema
  }

  [UPDATE_DELETE_DETAIL](state, action) {
    const deletes = R.path(['payload', 'data', 'checkDelete'], action)
    const groupedData = groupModels(deletes, '__typename')
    return { ...state, Delete: groupedData }
  }

  [CANCEL_DELETE_DETAIL](state) {
    return { ...state, Delete: undefined }
  }

  reduce(state = initState, action) {
    if (this && R.type(this[action.type]) === 'Function')
      return this[action.type](state, action)
    else return state
  }
}
