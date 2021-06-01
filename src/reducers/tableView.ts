import * as R from 'ramda'
import {
  INDEX_ADD_FILTER,
  INDEX_DELETE_FILTER,
  INDEX_CLEAR_FILTERS,
  INDEX_CHANGE_FILTER_FIELD,
  CHANGE_REL_TABLE_PAGE,
  CHANGE_GOTO_PAGE,
  CHANGE_REL_GOTO_PAGE,
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
  removeAll
} from '../utils/tableView'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'

/**
 * A class containing reducers handling table view actions
 */
export class TableViewReducer extends Reducer {
  /**
   * Creates a reducer object that can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   */
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }

  /**
   * Dispatched when adding a new filter rule on the Index page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string}}
   * @returns Updates conveyor.tableView.modelName.filter.filterOrder in state
   */
  [INDEX_ADD_FILTER](state: any, action: any) {
    const payload = R.prop('payload', action)
    const modelName = R.prop('modelName', payload)
    const filterOrder = R.pathOr(
      [],
      [modelName, 'filter', 'filterOrder'],
      state
    ) as any[]
    const newFilterOrder = filterOrder.slice()
    newFilterOrder.push('')
    return R.assocPath(
      [modelName, 'filter', 'filterOrder'],
      newFilterOrder,
      state
    )
  }

  /**
   * Dispatched when removing a filter rule on the index page
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, index: number}}
   * @returns Sets value of object {filterOrder, filterValue} in conveyor.tableView.modelName.filter to null
   */
  [INDEX_DELETE_FILTER](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
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

  /**
   * Dispatched when resetting all filters on the Index page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string}}
   * @returns Sets value of objects {filterOrder, filterValue} in conveyor.tableView.modelName.filter to null
   */
  [INDEX_CLEAR_FILTERS](state: any, action: any) {
    const payload = R.prop('payload', action)
    const modelName = R.prop('modelName', payload)
    return R.assocPath(
      [modelName, 'page', 'currentPage'],
      0,
      removeAll(state, modelName)
    )
  }

  /**
   * Dispatched when changing a filter rule's field on the Index page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, index: number}}
   * @returns Updates value of filter in conveyor.tableView.modelName.filter.filterOrder
   */
  [INDEX_CHANGE_FILTER_FIELD](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName, index } = { ...payload }
    const filterOrder = R.pathOr(
      [],
      [modelName, 'filter', 'filterOrder'],
      state
    ) as any[]
    const newFilterOrder = filterOrder.slice()
    newFilterOrder[index] = fieldName
    return R.assocPath(
      [modelName, 'filter', 'filterOrder'],
      newFilterOrder,
      state
    )
  }

  /**
   * Called each time a filter's input field is changed on the Index page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, value: any}}
   * @returns Updates conveyor.tableView.modelName.filter.filterValue.fieldName.value
   */
  [INDEX_TABLE_FILTER_CHANGE](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName, value } = { ...payload }
    return R.assocPath(
      [modelName, 'filter', 'filterValue', fieldName, 'value'],
      value,
      state
    )
  }

  /**
   * Dispatched after making a selection from the filter dropdown menu on the Index page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, operator: object}}
   * @returns Updates value of objects {label, value} in 
   * conveyor.tableView.modelName.filter.filterValue.fieldName.operator
   */
  [INDEX_TABLE_FILTER_DROPDOWN](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName, operator } = { ...payload }
    return R.assocPath(
      [modelName, 'filter', 'filterValue', fieldName, 'operator'],
      operator,
      state
    )
  }

  /**
   * Dispatched after applying all filter rules on the Index page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string}}
   * @returns Sets value of conveyor.tableView.modelName.page.currentpage to 0 and 
   * value of conveyor.tableView.modelName.filter.filtersAreActive to true
   */
  [INDEX_TABLE_FILTER_SUBMIT](state: any, action: any) {
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

  /**
   * Dispatched changing the sorting of a table.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string}}
   * @returns Updates conveyor.tableView.modelName.page.sort in state
   */
  [INDEX_TABLE_SORT_CHANGE](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName, sortKey } = { ...payload }
    return R.pipe(
      R.assocPath([modelName, 'sort'], { fieldName, sortKey }),
      R.assocPath([modelName, 'page', 'currentPage'], 0)
    )(state)
  }

  /**
   * Called when collapsing or expanding a table.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, id: string}}
   * @returns Toggles conveyor.tableView.modelName.fields.fieldName.collapse to True or False
   */
  [COLLAPSE_TABLE_CHANGE](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName, collapse } = { ...payload }
    return R.assocPath(
      [modelName, 'fields', fieldName, 'collapse'],
      !collapse,
      state
    )
  }

  /**
   * Dispatched when user changes page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, updatedPageIndex: number}}
   * @returns Updates conveyor.tableView.modelName.page.currentPage
   */
  [CHANGE_PAGE](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, updatedPageIndex, isValid = true } = { ...payload }
    const newState = R.assocPath([modelName, 'page', 'canGoto'], isValid, state)
    if (!isValid) {
      return newState
    }
    return R.assocPath(
      [modelName, 'page', 'currentPage'],
      updatedPageIndex,
      newState
    )
  }

  // todo: make sure works
  /**
   * Dispatched when changing pages on a relation table.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, updatedPageIndex: number}}
   * @returns Updates values of 'canGoto' and 'currentPage' in conveyor.tableView.modelName.fields.fieldName.page
   */
  [CHANGE_REL_TABLE_PAGE](state: any, action: any) {
    const payload = R.prop('payload', action)
    const {
      // @ts-ignore
      modelName,
      // @ts-ignore
      fieldName,
      // @ts-ignore
      updatedPageIndex,
      isValid = true
    } = {
      ...payload
    }
    const newState = R.assocPath(
      [modelName, 'fields', fieldName, 'page', 'canGoto'],
      isValid,
      state
    )
    if (!isValid) {
      return newState
    }
    return R.assocPath(
      [modelName, 'fields', fieldName, 'page', 'currentPage'],
      updatedPageIndex,
      newState
    )
  }

  /**
   * Dispatched every time the goto page input value on an index table changes
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, pageIndex: number}}
   * @returns Changes conveyor.tableView.modelName.page.goto to the user input
   */
  [CHANGE_GOTO_PAGE](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, pageIndex } = { ...payload }
    return R.assocPath([modelName, 'page', 'goto'], pageIndex, state)
  }

  // todo: make sure works
  /**
   * Called every time the goto page input value on a relation field table changes.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, pageIndex: number}}
   * @returns Updates conveyor.tableView.modelName.fields.fieldName.page.goto
   */
  [CHANGE_REL_GOTO_PAGE](state: any, action: any) {
    const payload = R.prop('payload', action)
    // @ts-ignore
    const { modelName, fieldName, pageIndex } = { ...payload }
    return R.assocPath(
      [modelName, 'fields', fieldName, 'page', 'goto'],
      pageIndex,
      state
    )
  }

  /**
   * Called by [fetchModelIndex](./modelepic.html#fetch_model_index) and 
   * [relationshipSelectMenuOpen](./optionsepic.html#relationship_select_menu_open)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, data: object}}
   * @returns Updates values of objects {page: {lastIndex, total, amtPerPage}} in conveyor.tableView.modelName
   */
  [UPDATE_MODEL_INDEX](state: any, action: any) {
    const payload = R.prop('payload', action)
    const modelName = R.prop('modelName', payload)
    // @ts-ignore
    const count = R.path(['payload', 'data', 'count'], action)

    let lastIndex = null
    if (count) {
      // @ts-ignore
      lastIndex = Math.ceil(count / DEFAULT_PAGINATION_AMT)
    }

    return R.pipe(
      R.assocPath([modelName, 'page', 'lastIndex'], lastIndex),
      R.assocPath([modelName, 'page', 'total'], count),
      R.assocPath([modelName, 'page', 'amtPerPage'], DEFAULT_PAGINATION_AMT)
    )(state)
  }

  /**
   * Called by [fetchModelDetail](./modelepic.html#fetch_model_detail)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, id: string, data: object}}
   * @returns Update's conveyor.tableView.modelName's in state with 
   * values from objects {page: {lastIndex, total, amtPerPage}}
   */
  [UPDATE_MODEL_DETAIL](state: any, action: any) {
    const payload = R.prop('payload', action)
    const modelName = R.prop('modelName', payload)
    // @ts-ignore
    const newNode = R.path(['payload', 'data', 'result'], action)

    if (newNode) {
      // @ts-ignore
      for (const [fieldName, obj] of Object.entries(newNode) as any) {
        const type = this.schema.getType(modelName, fieldName)

        // if multi-rel type
        if (type && type.includes('ToMany') && !R.isEmpty(obj)) {
          const totalDataLength = obj.length
          const lastIndexRel = Math.ceil(
            totalDataLength / DEFAULT_PAGINATION_AMT
          )
          if (lastIndexRel > 0) {
            state = R.pipe(
              R.assocPath(
                [modelName, 'fields', fieldName, 'page', 'lastIndex'],
                lastIndexRel
              ),
              R.assocPath(
                [modelName, 'fields', fieldName, 'page', 'total'],
                totalDataLength
              ),
              R.assocPath(
                [modelName, 'fields', fieldName, 'page', 'amtPerPage'],
                DEFAULT_PAGINATION_AMT
              )
            )(state)
          }
        }
      }
    }
    return state
  }
}
