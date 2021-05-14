import * as R from 'ramda'

export const initState = {
  darkMode:
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const selectUserPreferences = R.pathOr(initState, [
  'conveyor',
  'userPreferences'
])
export const selectDarkMode = R.pathOr(initState, [
  'conveyor',
  'userPreferences',
  'darkMode'
])
