import * as R from 'ramda'
import {
  SEARCH_QUERY_TEXT_CHANGED,
  SEARCH_QUERY_LINK_CLICKED,
  UPDATE_SEARCH_ENTRIES,
  SEARCH_BLUR,
  TRIGGER_SEARCH
} from '../actionConsts'
import { initState } from '../utils/search'

export class SearchReducer {
  constructor(schema) {
    this.schema = schema
  }

  [UPDATE_SEARCH_ENTRIES](state, action) {
    const data = R.pathOr({}, ['payload', 'data'], action)
    if (R.pathOr(0, ['search', 'length'], data) <= 0) {
      return { ...state, entries: [] }
    }

    const entries = R.pipe(
      R.propOr([], 'search'),
      R.map(entry => ({
        id: entry.id,
        modelName: entry.__typename,
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

  [SEARCH_QUERY_TEXT_CHANGED](state, action){
    const newQueryText = action.payload.queryText
    if (newQueryText) {
      return R.assoc('queryText', newQueryText, state)
    }
    return initState
  }

  [SEARCH_QUERY_LINK_CLICKED](){
    return initState
  }

  [SEARCH_BLUR](state){
    return R.assoc('dropdown', false, state)
  }

  [TRIGGER_SEARCH](state){
    return R.assoc('dropdown', true, state)
  }

  reduce(state = initState, action) {
    if (this && R.type(this[action.type]) === 'Function')
      return this[action.type](state, action)
    else return state
  }
}
