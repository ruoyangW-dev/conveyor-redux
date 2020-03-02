import * as R from 'ramda'
import {
  UPDATE_MODEL_INDEX,
  UPDATE_MODEL_DETAIL,
  UPDATE_DELETE_MODEL,
  REMOVE_INSTANCE
} from '../actionConsts'
import { initState, updateIndex, getDefaultModelStore } from '../utils/model'

export class ModelReducer {
  constructor(schema) {
    this.schema = schema
  }

  [UPDATE_MODEL_INDEX](state, action) {
    const modelName = R.path(['payload', 'modelName'], action)
    return updateIndex(
      state,
      modelName,
      R.pathOr([], ['payload', 'data', 'result'], action)
    )
  }

  [UPDATE_MODEL_DETAIL](state, action) {
    const modelName = R.path(['payload', 'modelName'], action)
    const id = R.path(['payload', 'id'], action)
    const store = { ...R.propOr(getDefaultModelStore(), modelName, state) }
    const oldNode = R.prop(id, store.values)
    const newNode = R.pathOr(
      R.path(['payload', 'data'], action),
      ['payload', 'data', 'result'],
      action
    )

    if (!oldNode) {
      store.order.push(id)
    }
    store.values[id] = newNode

    return { ...state, [modelName]: store }
  }

  [UPDATE_DELETE_MODEL](state, action) {
    const modelName = R.path(['payload', 'modelName'], action)
    const id = R.path(['payload', 'id'], action)
    const store = { ...R.propOr(getDefaultModelStore(), modelName, state) }
    store.values = R.dissoc(id, store.values)
    store.order = R.without([id], store.order)
    return { ...state, [modelName]: store }
  }

  [REMOVE_INSTANCE](state, action) {
    const modelName = R.path(['payload', 'modelName'], action)
    const id = R.path(['payload', 'id'], action)
    return R.assocPath(
      [modelName, 'values', id.toString()],
      { result: null },
      state
    )
  }

  reduce(state = initState, action) {
    if (this && R.type(this[action.type]) === 'Function')
      return this[action.type](state, action)
    else return state
  }
}
