import * as R from 'ramda'

export const initState = []

export const selectTooltip = R.pathOr(initState, ['conveyor', 'tooltip'])
