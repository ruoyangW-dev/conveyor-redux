import * as R from 'ramda'
import {
  SEARCH_QUERY_TEXT_CHANGED,
  SEARCH_QUERY_LINK_CLICKED,
  UPDATE_QUICK_SEARCH_ENTRIES,
  UPDATE_SEARCH_PAGE_ENTRIES,
  SEARCH_QUERY_FILTER_CLICKED,
  SEARCH_BLUR,
  TRIGGER_SEARCH
} from '../actionConsts'
import { initState } from '../utils/search'
import { Reducer } from './reducer'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Config } from '../types'

/**
 * A class containing reducers handling search actions
 */
export class SearchReducer extends Reducer {
  /**
   * Creates a reducer object that can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   * @param config Custom user inputted configurations
   */
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }

  /**
   * Dispatched by [fetchSearchEntries](./searchepic.html#fetch_search_entries)
   * @param state Redux state
   * @param action object {type: string, payload: {queryString: string, data: object}}
   * @returns Updates conveyor.search.quickSearchEntries with an object containing matching objects in state
   */
  [UPDATE_QUICK_SEARCH_ENTRIES](state: any, action: any) {
    const data: object[] = R.pathOr([], ['payload', 'data'], action)
    if (data.length <= 0) {
      return { ...state, entries: [] }
    }

    const quickSearchEntries = R.pipe(
      R.map((entry: any) => ({
        id: entry.id,
        modelName: entry.__typename,
        // @ts-ignore
        modelLabel: this.schema.getModelLabel({
          modelName: entry.__typename,
          node: entry
        }),
        name: this.schema.getDisplayValue({
          modelName: entry.__typename,
          node: entry
        })
      })),
      R.map((obj) => ({
        ...obj,
        detailURL: `/${obj.modelName}/${obj.id}`
      }))
    )(data)
    return { ...state, quickSearchEntries }
  }

  /**
   * Dispatched by [fetchSearchEntries](./searchepic.html#fetch_search_entries)
   * @param state Redux state
   * @param action object {type: string, payload: {queryString: string, data: object}}
   * @returns Updates conveyor.search.searchPageEntries with an object containing matching objects in state
   */
  [UPDATE_SEARCH_PAGE_ENTRIES](state: any, action: any) {
    const data: object[] = R.pathOr([], ['payload', 'data'], action)
    if (data.length <= 0) {
      return { ...state, searchPageEntries: [] }
    }

    const searchPageEntries = R.pipe(
      R.map((entry: any) => ({
        id: entry.id,
        modelName: entry.__typename,
        // @ts-ignore
        modelLabel: this.schema.getModelLabel({
          modelName: entry.__typename,
          node: entry
        }),
        name: this.schema.getDisplayValue({
          modelName: entry.__typename,
          node: entry
        })
      })),
      R.map((obj) => ({
        ...obj,
        detailURL: `/${obj.modelName}/${obj.id}`
      }))
    )(data)

    const models = R.map(
      (entry) => R.pick(['modelName'], entry),
      R.uniqBy(R.prop('modelName'), searchPageEntries)
    )
    const searchPageFilters = R.map(
      (filter) => R.assoc('checked', true, filter),
      models
    )

    return { ...state, searchPageEntries, searchPageFilters }
  }

  /**
   * Dispatched each time the search input is changed.
   * @param state Redux state
   * @param action object {type: string, payload: {queryText: string}}
   * @returns Updates conveyor.queryText with the new text in state
   */
  [SEARCH_QUERY_TEXT_CHANGED](state: any, action: any) {
    const newQueryText = action.payload.queryText
    if (newQueryText) {
      return R.assoc('queryText', newQueryText, state)
    }
    return initState
  }

  [SEARCH_QUERY_FILTER_CLICKED](state: any, action: any) {
    const modelName = R.pathOr('', ['payload', 'modelName'], action)
    const searchPageFilters = R.map(
      (searchPageFilter: any) =>
        // toggle the "checked" value if the entry's model name equals the filter that was clicked
        R.ifElse(
          R.equals(modelName),
          R.always(
            R.assoc('checked', !searchPageFilter.checked, searchPageFilter)
          ),
          R.always(searchPageFilter)
        )(searchPageFilter.modelName),
      state.searchPageFilters
    )
    return R.assoc('searchPageFilters', searchPageFilters, state)
  }

  /**
   * Dispatched after selecting a search query
   * @returns Sets conveyor.search to its initial state
   */
  [SEARCH_QUERY_LINK_CLICKED]() {
    return initState
  }

  /**
   * Dispatched when clicking outside the search box
   * @param state Redux state
   * @returns Sets conveyor.search.dropdown to false
   */
  [SEARCH_BLUR](state: any) {
    return R.assoc('dropdown', false, state)
  }

  /**
   * Dispatched when clicking inside the search box
   * @param state Redux state
   * @returns Sets conveyor.search.dropdown to true
   */
  [TRIGGER_SEARCH](state: any) {
    return R.assoc('dropdown', true, state)
  }
}
