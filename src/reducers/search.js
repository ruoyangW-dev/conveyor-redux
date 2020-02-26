import {
  SEARCH_QUERY_TEXT_CHANGED,
  SEARCH_QUERY_LINK_CLICKED,
  UPDATE_SEARCH_ENTRIES,
  SEARCH_BLUR,
  TRIGGER_SEARCH
} from '../actionConsts'
import * as R from 'ramda'
import { getDisplayValue, getModelLabel } from 'conveyor'

export const initState = {
  queryText: '',
  entries: [],
  dropdown: false
}

export const generateSearchReducer = ({ schema, customActions = {} }) => (
  state = initState,
  action
) => {
  if (R.has(action.type, customActions)) {
    return customActions[action.type](state)
  }

  switch (action.type) {
    case UPDATE_SEARCH_ENTRIES: {
      const data = R.pathOr({}, ['payload', 'data'], action)
      if (R.pathOr(0, ['search', 'length'], data) <= 0) {
        return { ...state, entries: [] }
      }

      const entries = R.pipe(
        R.propOr([], 'search'),
        R.map(entry => ({
          id: entry.id,
          modelName: entry.__typename,
          modelLabel: getModelLabel({
            schema,
            modelName: entry.__typename,
            node: entry
          }),
          name: getDisplayValue({
            schema,
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
    case SEARCH_QUERY_TEXT_CHANGED: {
      const newQueryText = action.payload.queryText
      if (newQueryText) {
        return R.assoc('queryText', newQueryText, state)
      }
      return initState
    }
    case SEARCH_QUERY_LINK_CLICKED:
      return initState
    case SEARCH_BLUR:
      return R.assoc('dropdown', false, state)
    case TRIGGER_SEARCH:
      return R.assoc('dropdown', true, state)
    default:
      return state
  }
}

export const selectSearch = R.propOr(initState, 'search')

export const selectSearchDropdown = state =>
  R.prop('dropdown', selectSearch(state))

export const selectSearchEntries = state =>
  R.prop('entries', selectSearch(state))

export const selectSearchQueryText = state =>
  R.prop('queryText', selectSearch(state))
