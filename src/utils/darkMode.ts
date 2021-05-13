import * as R from 'ramda'

export const initState: boolean = false

export const selectDarkMode = R.pathOr(initState, ['conveyor', 'darkMode'])
