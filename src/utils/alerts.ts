import * as R from 'ramda'

export interface Alert {
  message: string
  type: string
  expiresOn?: number
  noExpire?: boolean
}

export type AlertsState = Alert[]

export const initState: AlertsState = []

export const handleError = ({
  payload,
  type
}: {
  payload: Omit<Alert, 'type'>
  type: string
}): Alert => {
  if (!payload.expiresOn && !payload.noExpire) {
    payload.expiresOn = Date.now() + 5 * 1000
  }
  return R.assoc('type', type, payload)
}

export const selectAlerts = R.pathOr(initState, ['conveyor', 'alerts'])
