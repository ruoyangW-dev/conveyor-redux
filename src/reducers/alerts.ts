import { initState, handleError, AlertsState, Alert } from '../utils/alerts'
import {
  ADD_DANGER_ALERT,
  ADD_SUCCESS_ALERT,
  ADD_ALERT,
  DISMISS_ALERT
} from '../actionConsts'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer as ReducerClass } from './reducer'
import * as R from 'ramda'
import {
  AnyAction,
  createReducer,
  PayloadAction,
  Reducer
} from '@reduxjs/toolkit'

export class AlertsReducer extends ReducerClass {
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }

  [ADD_DANGER_ALERT](
    state: AlertsState,
    action: PayloadAction<Omit<Alert, 'type'>>
  ): AlertsState {
    return R.append(
      handleError({ payload: action.payload, type: 'danger' }),
      state
    )
  }
  [ADD_SUCCESS_ALERT](
    state: AlertsState,
    action: PayloadAction<Omit<Alert, 'type'>>
  ): AlertsState {
    return R.append(
      handleError({ payload: action.payload, type: 'success' }),
      state
    )
  }
  [ADD_ALERT](state: AlertsState, action: PayloadAction<Alert>): AlertsState {
    return R.append(
      handleError({
        payload: action.payload,
        type:
          typeof action.payload.type === 'string'
            ? action.payload.type
            : 'success'
      }),
      state
    )
  }
  [DISMISS_ALERT](
    state: AlertsState,
    action: PayloadAction<Alert>
  ): AlertsState {
    return R.filter(
      (alert) =>
        alert.expiresOn !== action.payload.expiresOn ||
        alert.message !== action.payload.message,
      state
    )
  }
}

export type AlertsOverrides = (
  schema: SchemaBuilder
) => Record<
  string,
  (
    state: AlertsState,
    action: PayloadAction<Alert> | PayloadAction<Omit<Alert, 'type'>>
  ) => AlertsState | void
>

export const makeAlertsReducer = (
  schema: SchemaBuilder,
  overrides?: AlertsOverrides
): Reducer<AlertsState, AnyAction> => {
  const defaultCases = {
    [ADD_DANGER_ALERT]: (
      state: AlertsState,
      action: PayloadAction<Omit<Alert, 'type'>>
    ): AlertsState | void => {
      state.push(handleError({ payload: action.payload, type: 'danger' }))
    },
    [ADD_SUCCESS_ALERT]: (
      state: AlertsState,
      action: PayloadAction<Omit<Alert, 'type'>>
    ): AlertsState | void => {
      state.push(handleError({ payload: action.payload, type: 'success' }))
    },
    [ADD_ALERT]: (
      state: AlertsState,
      action: PayloadAction<Alert>
    ): AlertsState | void => {
      state.push(
        handleError({
          payload: action.payload,
          type:
            typeof action.payload.type === 'string'
              ? action.payload.type
              : 'success'
        })
      )
    },
    [DISMISS_ALERT]: (
      state: AlertsState,
      action: PayloadAction<Alert>
    ): AlertsState | void => {
      return state.filter(
        (alert) =>
          alert.expiresOn !== action.payload.expiresOn ||
          alert.message !== action.payload.message
      )
    }
  }

  const cases = R.mergeRight(defaultCases, overrides ?? {})

  return createReducer(initState, (builder) => {
    for (const [key, value] of Object.entries(cases)) {
      builder.addCase(key, value)
    }
  })
}
