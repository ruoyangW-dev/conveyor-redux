import { ofType, ActionsObservable } from 'redux-observable'
import { map, mergeMap, delay, filter } from 'rxjs/operators'
import type { Action } from '../actions'
import * as Actions from '../actions'
import { ADD_SUCCESS_ALERT, ADD_DANGER_ALERT, ADD_ALERT } from '../actionConsts'
import { of } from 'rxjs'
import * as R from 'ramda'
import { Epic } from './epic'
import type { EpicPayload } from '../types'

export type ExpiresOnPayload = EpicPayload & { expiresOn: number }

export class AlertEpic extends Epic {
  [ADD_DANGER_ALERT](action$: ActionsObservable<Action<EpicPayload>>) {
    return action$.pipe(
      ofType(ADD_DANGER_ALERT),
      map(R.prop('payload')),
      filter(
        (payload: EpicPayload): payload is ExpiresOnPayload =>
          payload.expiresOn !== undefined
      ),
      mergeMap((payload: ExpiresOnPayload) => {
        const timeOfAlertDismiss = payload.expiresOn - Date.now()
        return of(Actions.dismissAlert(payload)).pipe(delay(timeOfAlertDismiss))
      })
    )
  }

  [ADD_SUCCESS_ALERT](action$: ActionsObservable<Action<EpicPayload>>) {
    return action$.pipe(
      ofType(ADD_SUCCESS_ALERT),
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

  [ADD_ALERT](action$: any) {
    return action$.pipe(
      ofType(ADD_ALERT),
      map(R.prop('payload')),
      filter(
        (payload: EpicPayload) => R.prop('expiresOn', payload) !== undefined
      ),
      mergeMap((payload: EpicPayload) => {
        // @ts-ignore
        const timeOfAlertDismiss = R.prop('expiresOn', payload) - Date.now()
        return of(Actions.dismissAlert(payload)).pipe(delay(timeOfAlertDismiss))
      })
    )
  }
}
