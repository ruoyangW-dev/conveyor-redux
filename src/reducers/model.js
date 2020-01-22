import * as R from 'ramda'
import * as Actions from '../actionConsts'
<<<<<<< HEAD

const initState = {}

export const getModelStore = (state, modelName) => R.path(['model', modelName], state)

export const getAllModelStore = (state) => R.path(['model'], state)
=======
import { selectTableView } from './tableView'

export const PAGINATION_AMT = 20

const initState = {}

export const getModelStore = (state, modelName) =>
  R.path(['model', modelName], state)

export const getModelStoreOrder = (state, modelName) =>
  R.path(['model', modelName, 'order'], state)

export const getPaginatedModel = (state, modelName) => {
  const amount = PAGINATION_AMT
  const idx = R.pathOr(0, ['page', modelName], selectTableView(state))
  const firstIdx = idx * amount
  const lastIdx = (idx + 1) * amount

  return getOrderedValues(getModelStore(state, modelName)).slice(
    firstIdx,
    lastIdx
  )
}

export const getAllModelStore = state => R.path(['model'], state)
>>>>>>> master

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
<<<<<<< HEAD
    const updatedNode = R.mergeDeepRight(oldNode, node)
    newStore.values[node.id] = updatedNode
=======
    newStore.values[node.id] = R.mergeDeepRight(oldNode, node)
>>>>>>> master
  }
  return { ...state, [modelName]: newStore }
}

<<<<<<< HEAD
export const generateModelReducer = schema => (state = initState, action) => {
=======
export const generateModelReducer = () => (state = initState, action) => {
>>>>>>> master
  const modelName = R.path(['payload', 'modelName'], action)

  switch (action.type) {
    case Actions.UPDATE_MODEL_INDEX: {
<<<<<<< HEAD
      return updateIndex(state, modelName, R.pathOr([], ['payload', 'data', 'result'], action))
    }

=======
      return updateIndex(
        state,
        modelName,
        R.pathOr([], ['payload', 'data', 'result'], action)
      )
    }
>>>>>>> master
    case Actions.UPDATE_MODEL_DETAIL: {
      const id = R.path(['payload', 'id'], action)
      const store = { ...R.propOr(getDefaultModelStore(), modelName, state) }
      const oldNode = R.prop(id, store.values)
<<<<<<< HEAD
      const newNode = R.pathOr(R.path(['payload', 'data'], action), ['payload', 'data', 'result'], action)

      if (!oldNode) {
        // node does not exist in store, add it
=======
      const newNode = R.pathOr(
        R.path(['payload', 'data'], action),
        ['payload', 'data', 'result'],
        action
      )

      if (!oldNode) {
>>>>>>> master
        store.order.push(id)
      }
      store.values[id] = newNode

      return { ...state, [modelName]: store }
    }
<<<<<<< HEAD

=======
>>>>>>> master
    default:
      return state
  }
}

<<<<<<< HEAD

=======
>>>>>>> master
export const selectModel = R.propOr(initState, 'model')
export const getDetailUrl = ({ modelName, id }) => `/${modelName}/${id}`
export const getIndexUrl = ({ modelName }) => `/${modelName}`
