import { ofType } from 'redux-observable'
import { map, mergeMap, delay, filter } from 'rxjs/operators'
import * as Actions from '../actions'
import { ADD_SUCCESS_ALERT, ADD_DANGER_ALERT, ADD_ALERT } from '../actionConsts'
import { of } from 'rxjs'
import * as R from 'ramda'
import { Epic } from './epic'
import type { EpicPayload } from '../types'

/**
 * Payload that expires after a set amount of time
 */
export type ExpiresOnPayload = EpicPayload & { expiresOn: number }

/**
 * A class made up of Epics handling Alerts
 */
export class AlertEpic extends Epic {
/**
 * An Epic that handles alerts of type *ADD_DANGER_ALERT*, *ADD_SUCCESS_ALERT*, or *ADD_ALERT*.\
 * Adds alert which is later dismissed through [dismissAlert](./alertsreducer.html#dismiss_alert)
 * @param action$ object {type: string, payload: {message: string, expiresOn: number}}
 * @returns - of(Actions.[dismissAlert](./alertsreducer.html#dismiss_alert)(payload).pipe(delay(timeOfAlertDismiss))
 */
  [ADD_ALERT](action$: any) {
    return action$.pipe(
      ofType(ADD_DANGER_ALERT, ADD_SUCCESS_ALERT, ADD_ALERT),
      map(R.prop('payload')),
      filter(
        (payload: EpicPayload): payload is ExpiresOnPayload =>
          payload.expiresOn !== undefined
      ),
      mergeMap((payload: EpicPayload & { expiresOn: number }) => {
        const timeOfAlertDismiss = payload.expiresOn - Date.now()
        return of(Actions.dismissAlert(payload)).pipe(delay(timeOfAlertDismiss))
      })
    )
  }
}
