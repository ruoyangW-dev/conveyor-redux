import * as R from 'ramda'

export const initState = {
  darkMode:
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Curried function that returns the result of conveyor.userPreferences from the passed in argument. 
 * Returns initState if the value is null.
 */
export const selectUserPreferences = R.pathOr(initState, [
  'conveyor',
  'userPreferences'
])

/** Curried function that returns conveyor.userPreferences.darkMode from the given argument, or 
 * returns init state if null
 */
export const selectDarkMode = R.pathOr(initState, [
  'conveyor',
  'userPreferences',
  'darkMode'
])
