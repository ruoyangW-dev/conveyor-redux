import * as R from 'ramda'

export const initState = {
  queryText: '',
  entries: [],
  dropdown: false
}

export const selectSearch = R.pathOr(initState, ['conveyor', 'search'])

export const selectSearchDropdown = (state: any) =>
  R.prop('dropdown', selectSearch(state))

export const selectSearchEntries = (state: any) =>
  R.prop('entries', selectSearch(state))

export const selectSearchQueryText = (state: any) =>
  R.prop('queryText', selectSearch(state))
