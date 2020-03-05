import * as R from 'ramda'
import {
  INDEX_ADD_FILTER,
  INDEX_DELETE_FILTER,
  INDEX_CLEAR_FILTERS,
  INDEX_CHANGE_FILTER_FIELD,
  CHANGE_REL_TABLE_PAGE,
  UPDATE_OVERVIEW_DISPLAYED,
  UPDATE_OVERVIEW_SELECTED,
  INDEX_TABLE_SORT_CHANGE,
  INDEX_TABLE_FILTER_SUBMIT,
  COLLAPSE_TABLE_CHANGE,
  CHANGE_PAGE,
  UPDATE_MODEL_INDEX,
  INDEX_TABLE_FILTER_CHANGE,
  INDEX_TABLE_FILTER_DROPDOWN,
  UPDATE_MODEL_DETAIL
} from '../actionConsts'
import {
  initState,
  DEFAULT_PAGINATION_AMT,
  removeAll,
  setValues
} from '../utils/tableView'

export class TableViewReducer {
  constructor(schema) {
    this.schema = schema
  }

  [INDEX_ADD_FILTER](state, action) {
    const payload = R.prop('payload', action)
    const modelName = R.prop('modelName', payload)
    const filterOrder = R.pathOr(
      [],
      [modelName, 'filter', 'filterOrder'],
      state
    )
    const newFilterOrder = filterOrder.slice()
    newFilterOrder.push('')
    return R.assocPath(
      [modelName, 'filter', 'filterOrder'],
      newFilterOrder,
      state
    )
  }

  [INDEX_DELETE_FILTER](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, index } = { ...payload }
    const filterOrder = R.pathOr(
      [],
      [modelName, 'filter', 'filterOrder'],
      state
    )
    const fieldName = filterOrder[index]
    const newFilterOrder = filterOrder.slice()
    newFilterOrder.splice(index, 1)
    if (R.isNil(newFilterOrder) || R.isEmpty(newFilterOrder)) {
      return removeAll(state, modelName)
    }
    return R.assocPath(
      [modelName, 'filter', 'filterOrder'],
      newFilterOrder,
      R.dissocPath([modelName, 'filter', 'filterValue', fieldName], state)
    )
  }

  [INDEX_CLEAR_FILTERS](state, action) {
    const payload = R.prop('payload', action)
    const modelName = R.prop('modelName', payload)
    return R.assocPath(
      [modelName, 'page', 'currentPage'],
      0,
      removeAll(state, modelName)
    )
  }

  [INDEX_CHANGE_FILTER_FIELD](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, index } = { ...payload }
    const filterOrder = R.pathOr(
      [],
      [modelName, 'filter', 'filterOrder'],
      state
    )
    const newFilterOrder = filterOrder.slice()
    newFilterOrder[index] = fieldName
    return R.assocPath(
      [modelName, 'filter', 'filterOrder'],
      newFilterOrder,
      state
    )
  }

  [INDEX_TABLE_FILTER_CHANGE](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, value } = { ...payload }
    return R.assocPath(
      [modelName, 'filter', 'filterValue', fieldName, 'value'],
      value,
      state
    )
  }

  [INDEX_TABLE_FILTER_DROPDOWN](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, operator } = { ...payload }
    return R.assocPath(
      [modelName, 'filter', 'filterValue', fieldName, 'operator'],
      operator,
      state
    )
  }

  [INDEX_TABLE_FILTER_SUBMIT](state, action) {
    const payload = R.prop('payload', action)
    const modelName = R.prop('modelName', payload)
    const currentFilters = R.pathOr(
      [],
      [modelName, 'filter', 'filterOrder'],
      state
    )
    const filtersAreActive = !(
      R.isNil(currentFilters) || Object.entries(currentFilters).length === 0
    )
    return R.pipe(
      R.assocPath([modelName, 'filter', 'filtersAreActive'], filtersAreActive),
      R.assocPath([modelName, 'page', 'currentPage'], 0)
    )(state)
  }

  [INDEX_TABLE_SORT_CHANGE](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, sortKey } = { ...payload }
    return R.pipe(
      R.assocPath([modelName, 'sort'], { fieldName, sortKey }),
      R.assocPath([modelName, 'page', 'currentPage'], 0)
    )(state)
  }

  [COLLAPSE_TABLE_CHANGE](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, collapse } = { ...payload }
    return R.assocPath(
      [modelName, 'fields', fieldName, 'collapse'],
      !collapse,
      state
    )
  }

  [CHANGE_PAGE](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, updatedPageIndex } = { ...payload }
    return R.assocPath(
      [modelName, 'page', 'currentPage'],
      updatedPageIndex,
      state
    )
  }

  [CHANGE_REL_TABLE_PAGE](state, action) {
    const payload = R.prop('payload', action)
    const { modelName, fieldName, updatedPageIndex } = { ...payload }
    return R.assocPath(
      [modelName, 'fields', fieldName, 'page', 'currentPage'],
      updatedPageIndex,
      state
    )
  }

  [UPDATE_MODEL_INDEX](state, action) {
    const payload = R.prop('payload', action)
    const data = R.pathOr([], ['data', 'result'], payload)
    const modelName = R.prop('modelName', payload)
    const amtPerPage = R.prop('amtPerPage', state) || DEFAULT_PAGINATION_AMT

    let lastIndex = null
    if (!R.isEmpty(data)) {
      const totalDataLength = data.length
      lastIndex = Math.floor((totalDataLength - 1) / amtPerPage)
    }

    return R.pipe(
      R.assocPath([modelName, 'page', 'lastIndex'], lastIndex),
      R.assocPath([modelName, 'page', 'total'], data.length)
    )(state)
  }

  [UPDATE_MODEL_DETAIL](state, action) {
    const payload = R.prop('payload', action)
    const modelName = R.prop('modelName', payload)
    const newNode = R.pathOr(
      R.prop('data', payload),
      ['data', 'result'],
      payload
    )
    const amtPerPage = R.prop('amtPerPage', state) || DEFAULT_PAGINATION_AMT

    if (newNode) {
      for (const [fieldName, obj] of Object.entries(newNode)) {
        const type = this.schema.getType(modelName, fieldName)

        // if multi-rel type
        if (type && type.includes('ToMany') && !R.isEmpty(obj)) {
          const totalDataLength = obj.length
          const lastIndexRel = Math.floor((totalDataLength - 1) / amtPerPage)
          if (lastIndexRel > 0) {
            state = R.pipe(
              R.assocPath(
                [modelName, 'fields', fieldName, 'page', 'lastIndex'],
                lastIndexRel
              ),
              R.assocPath(
                [modelName, 'fields', fieldName, 'page', 'total'],
                totalDataLength
              )
            )(state)
          }
        }
      }
    }
    return state
  }

  [UPDATE_OVERVIEW_DISPLAYED](state, action) {
    return setValues(state, R.prop('payload', action), 'selected')
  }

  [UPDATE_OVERVIEW_SELECTED](state, action) {
    return setValues(state, R.prop('payload', action), 'displayed')
  }

  reduce(state = initState, action) {
    if (this && R.type(this[action.type]) === 'Function')
      return this[action.type](state, action)
    else return state
  }
}
