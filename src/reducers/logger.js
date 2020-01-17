import * as Actions from '../actionConsts'
import * as R from 'ramda'

export const initState = []

const handleError = ({ payload, type }) => {
  if (!payload.expiresOn && !payload.noExpire) {
    payload.expiresOn = Date.now() + 5 * 1000
  }
  return R.assoc('type', type, payload)
}

export const generateLoggerReducer = schema => (state = initState, action) => {
  switch (action.type) {
    case Actions.ERROR_LOGGER:
      return [...state, handleError({ payload: action.payload, type: 'danger' })]

    default:
      return state
  }
}

export const selectErrors = R.propOr(initState, 'errors')