import * as Actions from '../actionConsts'
import * as R from 'ramda'
import { PAGINATION_AMT } from './model'
import { getType } from 'conveyor'

const initState = {}

export const generateTableViewReducer = (schema) => (state = initState, action) => {
  const payload = action.payload
  const removeAll = modelName => {
    return R.dissocPath(
      [modelName, 'filter', 'filterOrder'],
      R.dissocPath([modelName, 'filter', 'filterValue'], state)
    )
  }
  const setValues = type => {
    const modelName = R.prop('modelName', payload)
    const values = R.prop('values', payload)
    return R.assocPath([modelName, type], values, state)
  }

  switch (action.type) {
    case Actions.INDEX_ADD_FILTER: {
      const modelName = R.prop('modelName', payload)
      const filterOrder = R.pathOr([], [modelName, 'filter', 'filterOrder'], state)
      const newFilterOrder = filterOrder.slice()
      newFilterOrder.push('')
      return R.assocPath(
        [modelName, 'filter', 'filterOrder'],
        newFilterOrder,
        state
      )
    }
    case Actions.INDEX_DELETE_FILTER: {
      const { modelName, index } = { ...payload }
      const filterOrder = R.pathOr([], [modelName, 'filter', 'filterOrder'], state)
      const fieldName = filterOrder[index]
      const newFilterOrder = filterOrder.slice()
      newFilterOrder.splice(index, 1)
      if (R.isNil(newFilterOrder) || R.isEmpty(newFilterOrder)) {
        return removeAll(modelName)
      }
      return R.assocPath(
        [modelName, 'filter', 'filterOrder'],
        newFilterOrder,
        R.dissocPath(
          [modelName, 'filter', 'filterValue', fieldName],
          state
        )
      )
    }
    case Actions.INDEX_CLEAR_FILTERS: {
      const modelName = R.prop('modelName', payload)
      return removeAll(modelName)
    }
    case Actions.INDEX_CHANGE_FILTER_FIELD: {
      const { modelName, fieldName, index } = { ...payload }
      const filterOrder = R.pathOr([], [modelName, 'filter', 'filterOrder'], state)
      const newFilterOrder = filterOrder.slice()
      newFilterOrder[index] = fieldName
      return R.assocPath(
        [modelName, 'filter', 'filterOrder'],
        newFilterOrder,
        state
      )
    }
    case Actions.INDEX_TABLE_FILTER_CHANGE: {
      const { modelName, fieldName, value } = { ...payload }
      return R.assocPath(
        [modelName, 'filter', 'filterValue', fieldName, 'value'],
        value,
        state
      )
    }
    case Actions.INDEX_TABLE_FILTER_DROPDOWN: {
      const { modelName, fieldName, operator } = { ...payload }
      return R.assocPath(
        [modelName, 'filter', 'filterValue', fieldName, 'operator'],
        operator,
        state
      )
    }
    case Actions.INDEX_TABLE_FILTER_SUBMIT: {
      const modelName = R.prop('modelName', payload)
      const currentFilters = R.pathOr([], [modelName, 'filter', 'filterOrder'], state)
      const filtersAreActive = !(R.isNil(currentFilters) || Object.entries(currentFilters).length === 0)
      return R.assocPath(
        [modelName, 'filter', 'filtersAreActive'],
        filtersAreActive,
        state
      )
    }
    case Actions.INDEX_TABLE_SORT_CHANGE: {
      const { modelName, fieldName, sortKey } = { ...payload }
      return R.assocPath(
        [modelName, 'sort'],
        { fieldName, sortKey },
        state
      )
    }
    case Actions.COLLAPSE_TABLE_CHANGE: {
      const { modelName, fieldName, collapse } = { ...payload }
      return R.assocPath(
        [modelName, 'fields', fieldName, 'collapse'],
        !collapse,
        state
      )
    }
    case Actions.CHANGE_PAGE: {
      const { modelName, updatedPageIndex } = { ...payload }
      return R.assocPath(
        [modelName, 'page', 'currentPage'],
        updatedPageIndex,
        state
      )
    }
    case Actions.CHANGE_REL_TABLE_PAGE: {
      const { modelName, fieldName, updatedPageIndex } = { ...payload }
      return R.assocPath(
        [modelName, 'fields', fieldName, 'page', 'currentPage'],
        updatedPageIndex,
        state
      )
    }
    case Actions.UPDATE_MODEL_INDEX: {
      const data = R.pathOr([], ['data', 'result'], payload)
      const modelName = R.prop('modelName', payload)

      let lastIndex = null
      if (!R.isEmpty(data)) {
        const totalDataLength = data.length
        lastIndex = Math.floor((totalDataLength - 1) / PAGINATION_AMT)
      }

      return R.assocPath(
        [modelName, 'page', 'lastIndex'],
        lastIndex,
        state
      )
    }
    case Actions.UPDATE_MODEL_DETAIL: {
      const modelName = R.prop('modelName', payload)
      const newNode = R.pathOr(
        R.prop('data', payload),
        ['data', 'result'],
        payload
      )

      if (newNode) {
        for (const [fieldName, obj] of Object.entries(newNode)) {
          const type = getType({ schema, modelName, fieldName })

          // if multi-rel type
          if (type && type.includes('ToMany') && !R.isEmpty(obj)) {
            const totalDataLength = obj.length
            const lastIndexRel = Math.floor((totalDataLength - 1) / PAGINATION_AMT)
            if (lastIndexRel > 0) {
              state = R.assocPath(
                [modelName, 'fields', fieldName, 'page', 'lastIndex'],
                lastIndexRel,
                state
              )
            }
          }
        }
      }
      return state
    }
    case Actions.UPDATE_OVERVIEW_DISPLAYED: {
      return setValues('selected')
    }
    case Actions.UPDATE_OVERVIEW_SELECTED: {
      return setValues('displayed')
    }

    default:
      return state
  }
}

export const selectTableView = state => R.prop('tableView', state)
