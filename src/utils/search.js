import * as R from 'ramda'

export const initState = {
  queryText: '',
  entries: [],
  dropdown: false
}

export const selectSearch = R.pathOr(initState, ['conveyor', 'search'])

export const selectSearchDropdown = state =>
  R.prop('dropdown', selectSearch(state))

export const selectSearchEntries = state =>
  R.prop('entries', selectSearch(state))

export const selectSearchQueryText = state =>
  R.prop('queryText', selectSearch(state))
