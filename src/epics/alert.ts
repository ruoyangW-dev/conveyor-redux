import { ofType } from 'redux-observable'
import { map, mergeMap, delay, filter } from 'rxjs/operators'
import * as Actions from '../actions'
import { ADD_SUCCESS_ALERT, ADD_DANGER_ALERT, ADD_ALERT } from '../actionConsts'
import { of } from 'rxjs'
import * as R from 'ramda'
import { Epic } from './epic'
import type { EpicPayload } from '../types'

export type ExpiresOnPayload = EpicPayload & { expiresOn: number }

export class AlertEpic extends Epic {
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
