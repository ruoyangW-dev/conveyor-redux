import * as R from 'ramda'
import { selectTableView } from '../utils/tableView'
import { getType } from '@autoinvent/conveyor'

export const initState = {}

export const DEFAULT_PAGINATION_AMT = 20

export const slicePageData = (data, idx, amount) => {
  const firstIdx = idx * amount // obj of firstIdx included
  const lastIdx = (idx + 1) * amount // obj of lastIdx NOT included => cutoff point

  // slice(first_index, cutoff_index)
  return data.slice(firstIdx, lastIdx)
}

export const getModelStore = (state, modelName) =>
  R.path(['conveyor', 'model', modelName], state)

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

export const getDefaultModelStore = () => ({ order: [], values: {} })

export const getOrderedValues = store => {
  const order = R.prop('order', store)
  const values = R.prop('values', store)
  if (R.isNil(order) || R.isNil(values)) {
    return []
  }
  return order.map(id => values[id])
}

export const updateIndex = (state, modelName, data) => {
  const oldStore = R.propOr(getDefaultModelStore(), modelName, state)
  const newStore = getDefaultModelStore()

  newStore.order = data.map(R.prop('id'))
  for (const node of data) {
    const oldNode = R.propOr({}, node.id, oldStore.values)
    newStore.values[node.id] = R.mergeDeepRight(oldNode, node)
  }
  return { ...state, [modelName]: newStore }
}

export const selectModel = R.pathOr(initState, ['conveyor', 'model'])
export const getDetailUrl = ({ modelName, id }) => `/${modelName}/${id}`
export const getIndexUrl = ({ modelName }) => `/${modelName}`
