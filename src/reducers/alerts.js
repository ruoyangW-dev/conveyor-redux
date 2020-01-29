import * as Actions from '../actionConsts'
import * as R from 'ramda'

export const initState = []

const handleError = ({ payload, type }) => {
  if (!payload.expiresOn && !payload.noExpire) {
    payload.expiresOn = Date.now() + 5 * 1000
  }
  return R.assoc('type', type, payload)
}

export const generateAlertReducer = schema => (state = initState, action) => {
  switch (action.type) {
    case Actions.ADD_DANGER_ALERT:
      return [
        ...state,
        handleError({ payload: action.payload, type: 'danger' })
      ]

    default:
      return state
  }
}

export const selectAlerts = R.propOr(initState, 'alerts')

