import * as R from 'ramda'

export const initState: any[] = []

export const handleError = ({
  payload,
  type
}: {
  payload: any
  type: string
}) => {
  if (!payload.expiresOn && !payload.noExpire) {
    payload.expiresOn = Date.now() + 5 * 1000
  }
  return R.assoc('type', type, payload)
}

export const selectAlerts = R.pathOr(initState, ['conveyor', 'alerts'])
