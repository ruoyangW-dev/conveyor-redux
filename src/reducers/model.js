import * as R from 'ramda'
import * as Actions from '../actionConsts'
import { selectTableView } from './tableView'
import { getType } from 'conveyor'

const DEFAULT_PAGINATION_AMT = 20

const initState = {}

export const getModelStore = (state, modelName) =>
  R.path(['model', modelName], state)

const slicePageData = (data, idx, amount) => {
  const firstIdx = idx * amount // obj of firstIdx included
  const lastIdx = (idx + 1) * amount // obj of lastIdx NOT included => cutoff point

  // slice(first_index, cutoff_index)
  return data.slice(firstIdx, lastIdx)
}

export const getPaginatedModel = (state, modelName) => {
  const idx = R.pathOr(
    0,
    [modelName, 'page', 'currentPage'],
    selectTableView(state)
  )
  const amount = R.propOr(
    DEFAULT_PAGINATION_AMT,
    'amtPerPage',
    selectTableView(state)
  )
  return slicePageData(
    getOrderedValues(getModelStore(state, modelName)),
    idx,
    amount
  )
}

export const getPaginatedNode = (schema, state, modelName, id) => {
  const modelStore = getModelStore(state, modelName)
  const node = R.pathOr(null, ['values', id], modelStore)
  const amount = R.propOr(
    DEFAULT_PAGINATION_AMT,
    'amtPerPage',
    selectTableView(state)
  )

  // do not change the redux store
  const updatedNode = {}
  if (node) {
    for (const [fieldName, obj] of Object.entries(node)) {
      const type = getType({ schema, modelName, fieldName })

      // if multi-rel type
      if (type && type.includes('ToMany') && !R.isEmpty(obj)) {
        const idx = R.pathOr(
          0,
          [modelName, 'fields', fieldName, 'page', 'currentPage'],
          selectTableView(state)
        )
        updatedNode[fieldName] = slicePageData(obj, idx, amount)
      } else {
        updatedNode[fieldName] = obj
      }
    }
  }
  return updatedNode
}

export const getAllModelStore = state => R.path(['model'], state)

export const getTabIdentifier = ({ modelName, tabList }) => {
  return R.prepend(modelName, tabList).join('.')
}

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

export const generateModelReducer = ({ customActions = {} }) => (
  state = initState,
  action
) => {
  if (R.has(action.type, customActions)) {
    return customActions[action.type](state, action)
  }

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
    case Actions.UPDATE_DELETE_MODEL: {
      const id = R.path(['payload', 'id'], action)
      const store = { ...R.propOr(getDefaultModelStore(), modelName, state) }
      store.values = R.dissoc(id, store.values)
      store.order = R.without([id], store.order)
      return { ...state, [modelName]: store }
    }
    case Actions.REMOVE_INSTANCE: {
      const modelName = R.path(['payload', 'modelName'], action)
      const id = R.path(['payload', 'id'], action)
      return R.assocPath(
        [modelName, 'values', id.toString()],
        { result: null },
        state
      )
    }

    default:
      return state
  }
}

export const selectModel = R.propOr(initState, 'model')
export const getDetailUrl = ({ modelName, id }) => `/${modelName}/${id}`
export const getIndexUrl = ({ modelName }) => `/${modelName}`
