import * as R from 'ramda'

export const initState = []

export const handleError = ({ payload, type }) => {
  if (!payload.expiresOn && !payload.noExpire) {
    payload.expiresOn = Date.now() + 5 * 1000
  }
  return R.assoc('type', type, payload)
}