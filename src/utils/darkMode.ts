import * as R from 'ramda'

export const initState = false

export const selectDarkMode = R.pathOr(initState, ['conveyor', 'darkMode'])
