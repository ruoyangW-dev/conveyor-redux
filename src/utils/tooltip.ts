import * as R from 'ramda'

export const initState = []

/**
 * Curried function that returns the value of conveyor.tolltip from the passed in argument. 
 * Returns initState if the value is null.
 */
export const selectTooltip = R.pathOr(initState, ['conveyor', 'tooltip'])
