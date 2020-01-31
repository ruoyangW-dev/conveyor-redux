import * as R from 'ramda'
import * as Actions from '../actionConsts'
import { selectTableView } from './tableView'

export const PAGINATION_AMT = 20

const initState = {}

export const getModelStore = (state, modelName) =>
  R.path(['model', modelName], state)

export const getModelStoreOrder = (state, modelName) =>
  R.path(['model', modelName, 'order'], state)

export const getPaginatedModel = (state, modelName) => {
  const amount = PAGINATION_AMT
  const idx = R.pathOr(0, [modelName, 'page', 'currentPage'], selectTableView(state))
  const firstIdx = idx * amount
  const lastIdx = (idx + 1) * amount

  return getOrderedValues(getModelStore(state, modelName)).slice(
    firstIdx,
    lastIdx
  )
}

export const getAllModelStore = state => R.path(['model'], state)

const getDefaultModelStore = () => ({ order: [], values: {} })

export const getOrderedValues = store => {
  const order = R.prop('order', store)
  const values = R.prop('values', store)
  if (R.isNil(order) || R.isNil(values)) {
    return []
  }
  return order.map(id => values[id])
}

const updateIndex = (state, modelName, data) => {
  const oldStore = R.propOr(getDefaultModelStore(), modelName, state)
  const newStore = getDefaultModelStore()

  newStore.order = data.map(R.prop('id'))
  for (const node of data) {
    const oldNode = R.propOr({}, node.id, oldStore.values)
    newStore.values[node.id] = R.mergeDeepRight(oldNode, node)
  }
  return { ...state, [modelName]: newStore }
}

export const generateModelReducer = () => (state = initState, action) => {
  const modelName = R.path(['payload', 'modelName'], action)

  switch (action.type) {
    case Actions.UPDATE_MODEL_INDEX: {
      return updateIndex(
        state,
        modelName,
        R.pathOr([], ['payload', 'data', 'result'], action)
      )
    }
    case Actions.UPDATE_MODEL_DETAIL: {
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

    default:
      return state
  }
}

export const selectModel = R.propOr(initState, 'model')
export const getDetailUrl = ({ modelName, id }) => `/${modelName}/${id}`
export const getIndexUrl = ({ modelName }) => `/${modelName}`
