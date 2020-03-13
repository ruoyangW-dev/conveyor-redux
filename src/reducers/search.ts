import * as R from 'ramda'
import {
  SEARCH_QUERY_TEXT_CHANGED,
  SEARCH_QUERY_LINK_CLICKED,
  UPDATE_SEARCH_ENTRIES,
  SEARCH_BLUR,
  TRIGGER_SEARCH
} from '../actionConsts'
import { initState } from '../utils/search'
import { Reducer } from './reducer'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

export class SearchReducer extends Reducer {
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }

  [UPDATE_SEARCH_ENTRIES](state: any, action: any) {
    const data: object[] = R.pathOr([], ['payload', 'data'], action)
    if (data.length <= 0) {
      return { ...state, entries: [] }
    }

    const entries = R.pipe(
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
      R.map(obj => ({
        ...obj,
        detailURL: `/${obj.modelName}/${obj.id}`
      }))
    )(data)
    return { ...state, entries }
  }

  [SEARCH_QUERY_TEXT_CHANGED](state: any, action: any) {
    const newQueryText = action.payload.queryText
    if (newQueryText) {
      return R.assoc('queryText', newQueryText, state)
    }
    return initState
  }

  [SEARCH_QUERY_LINK_CLICKED]() {
    return initState
  }

  [SEARCH_BLUR](state: any) {
    return R.assoc('dropdown', false, state)
  }

  [TRIGGER_SEARCH](state: any) {
    return R.assoc('dropdown', true, state)
  }
}
