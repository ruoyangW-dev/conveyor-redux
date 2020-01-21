import * as Actions from '../actionConsts'
import * as R from 'ramda'
import { getModelStoreOrder, PAGINATION_AMT } from './model'

const initState = {}

export const generateTableViewReducer = () => (state = initState, action) => {
  const payload = action.payload
  const removeAll = modelName => {
    return R.dissocPath(
      ['filterOrder', modelName],
      R.dissocPath(['filter', modelName], state)
    )
  }

  switch (action.type) {
    case Actions.INDEX_ADD_FILTER: {
      const modelName = R.prop('modelName', payload)
      const filterOrder = R.pathOr([], ['filterOrder', modelName], state)
      const newFilterOrder = filterOrder.slice()
      newFilterOrder.push('')
      return R.assocPath(['filterOrder', modelName], newFilterOrder, state)
    }
    case Actions.INDEX_CLEAR_FILTERS: {
      const modelName = R.prop('modelName', payload)
      return removeAll(modelName)
    }
    case Actions.INDEX_CHANGE_FILTER_FIELD: {
      const { modelName, fieldName, index } = { ...payload }
      const filterOrder = R.pathOr([], ['filterOrder', modelName], state)
      const newFilterOrder = filterOrder.slice()
      newFilterOrder[index] = fieldName
      return R.assocPath(['filterOrder', modelName], newFilterOrder, state)
    }
    case Actions.INDEX_DELETE_FILTER: {
      const { modelName, index } = { ...payload }
      const filterOrder = R.pathOr([], ['filterOrder', modelName], state)
      const fieldName = filterOrder[index]
      const newFilterOrder = filterOrder.slice()
      newFilterOrder.splice(index, 1)
      if (R.isNil(newFilterOrder) || R.isEmpty(newFilterOrder)) {
        return removeAll(modelName)
      }
      return R.assocPath(
        ['filterOrder', modelName],
        newFilterOrder,
        R.dissocPath(['filter', modelName, fieldName], state)
      )
    }
    case Actions.INDEX_TABLE_FILTER_CHANGE: {
      const { modelName, fieldName, value } = { ...payload }
      return R.assocPath(
        ['filter', modelName, fieldName, 'value'],
        value,
        state
      )
    }
    case Actions.INDEX_TABLE_FILTER_SUBMIT: {
      const modelName = R.prop('modelName', payload)
      const currentFilters = R.pathOr([], ['filterOrder', modelName], state)
      const filtersAreActive = !(
        R.isNil(currentFilters) || Object.entries(currentFilters).length === 0
      )
      return R.assocPath(
        ['filtersAreActive', modelName],
        filtersAreActive,
        state
      )
    }
    case Actions.INDEX_TABLE_FILTER_DROPDOWN: {
      const { modelName, fieldName, operator } = { ...payload }
      return R.assocPath(
        ['filter', modelName, fieldName, 'operator'],
        operator,
        state
      )
    }
    case Actions.INDEX_TABLE_SORT_CHANGE: {
      const { modelName, fieldName, sortKey } = { ...payload }
      return R.assocPath(['sort', modelName], { fieldName, sortKey }, state)
    }
    case Actions.HIDE_TABLE_CHANGE: {
      const { modelName, fieldName, id, hideTable } = { ...payload }
      return R.assocPath(
        ['hideTable', modelName, id.toString(), fieldName],
        !hideTable,
        state
      )
    }
    case Actions.CHANGE_PAGE: {
      const { modelName, updatedPageIndex } = { ...payload }
      return R.assocPath(['page', modelName], updatedPageIndex, state)
    }

    default:
      return state
  }
}

export const selectTableView = state => R.prop('tableView', state)
export const selectPaginatedTableView = (state, modelName) => {
  const modelOrder = getModelStoreOrder(state, modelName)

  let lastIndex = null
  if (modelOrder) {
    const totalDataLength = modelOrder.length
    lastIndex = Math.floor((totalDataLength - 1) / PAGINATION_AMT)
  }

  return R.assocPath(
    ['lastIndexPagination', modelName],
    lastIndex,
    selectTableView
  )
}
