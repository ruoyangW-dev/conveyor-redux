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

/** Curried function that returns conveyor.alerts from the argument passed in, or an empty list if no alerts */
export const selectAlerts = R.pathOr(initState, ['conveyor', 'alerts'])
