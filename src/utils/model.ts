import * as R from 'ramda'
import { selectTableView } from './tableView'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

export const initState = {}

export const DEFAULT_PAGINATION_AMT = 20

export const slicePageData = (data: any, idx: number, amount: number) => {
  const firstIdx = idx * amount // obj of firstIdx included
  const lastIdx = (idx + 1) * amount // obj of lastIdx NOT included => cutoff point

  // slice(first_index, cutoff_index)
  return data.slice(firstIdx, lastIdx)
}

export const getModelStore = (state: any, modelName: string) =>
  R.path(['conveyor', 'model', modelName], state)

export const getAllModelStore = (state: any) => R.path(['model'], state)

export const getTabIdentifier = ({
  modelName,
  tabList
}: {
  modelName: string
  tabList: any
}) => {
  return R.prepend(modelName, tabList).join('.')
}

export const getDefaultModelStore = () => ({ order: [], values: {} })

export const getOrderedValues = (store: any) => {
  const order = R.prop('order', store)
  const values = R.prop('values', store)
  if (R.isNil(order) || R.isNil(values)) {
    return []
  }
  return order.map((id: string) => values[id])
}

export const updateIndex = (state: any, modelName: string, data: any) => {
  const oldStore = R.propOr(getDefaultModelStore(), modelName, state) as any
  const newStore = getDefaultModelStore() as any

  newStore.order = data.map(R.prop('id'))
  for (const node of data) {
    const oldNode = R.propOr({}, node.id, oldStore.values)
    newStore.values[node.id] = R.mergeDeepRight(oldNode, node)
  }
  return { ...state, [modelName]: newStore }
}

export const selectModel = R.pathOr(initState, ['conveyor', 'model'])
export const getDetailUrl = ({
  modelName,
  id
}: {
  modelName: string
  id: string
}) => `/${modelName}/${id}`
export const getIndexUrl = ({ modelName }: { modelName: string }) =>
  `/${modelName}`
