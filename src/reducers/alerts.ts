import { initState, handleError } from '../utils/alerts'
import {
  ADD_DANGER_ALERT,
  ADD_SUCCESS_ALERT,
  ADD_ALERT,
  DISMISS_ALERT
} from '../actionConsts'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import * as R from 'ramda'

/**
 * A class made of up reducers handling alerts states
 */
export class AlertsReducer extends Reducer {
  /**
   * Creates a reducer object which can reduce all reducers into one reducer
   * @param schema [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   */
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }

  /**
   * Adds a 'danger'-type alert to 'state.alert' \
   * Dispatched during error checks from [saveCreateCheck](./validationepic.html#save_create_check), 
   * [fetchSearchEntries](./searchepic.html#fetch_search_entries), 
   * [combineEpicsAndCatchErrors](../modules.html#combineepicsandcatcherrors), 
   * and all epics from [edit](./editepic.html), [modal](./modalepic.html), [model](./modelepic.html), 
   * [option](./optionsepic.html), [tooltip](./tooltipepic.html), and [validation](./validationepic.html)
   * @param state Redux state
   * @param action object {type: string, payload: {message: string, expiresOn: number}}
   * @returns Adds danger-type alert object to conveyor.alerts in state
   */
  [ADD_DANGER_ALERT](state: any, action: any) {
    return [...state, handleError({ payload: action.payload, type: 'danger' })]
  }

  /**
   * Adds a 'success'-type alert to Redux 'state.alert' \
   * Dispatched from [saveCreate](./validationepic.html#save_create), [onDetailRemoveSubmit](./editepic.html#detail_table_remove_submit), 
   * [onInlineFileDelete](./editepic.html#inline_file_delete), [requestDeleteModel](./modelepic.html#request_delete_model), 
   * [requestDeleteRelTableModel](./modelepic.html#request_delete_rel_table_model), and 
   * [requestDeleteModelFromDetailPage](./modelepic.html#request_delete_model_from_detail_page).
   * @param state Redux state
   * @param action object {type: string, payload: {message: string, expiresOn: number}}
   * @returns Adds success-type alert object to conveyor.alerts in state
   */
  [ADD_SUCCESS_ALERT](state: any, action: any) {
    return [...state, handleError({ payload: action.payload, type: 'success' })]
  }

  /**
   * Adds a user-defined type alert to Redux 'state.alert'
   * @param state Redux state
   * @param action object {type: string, payload: {message: string, expiresOn: string}}
   * @returns Adds custom alert type to conveyor.alerts in state
   */
  [ADD_ALERT](state: any, action: any) {
    const alertType = R.prop('type', action.payload)
    // @ts-ignore
    return [
      ...state,
      handleError({
        payload: action.payload,
        type: typeof alertType === 'string' ? alertType : 'success'
      })
    ]
  }

  /**
   * Dispathced from [addDangerAlert](./alertsreducer.html#add_danger_alert),
   * [addSuccessAlert](./alertsreducer.html#add_success_alert),
   * [addAlert](./alertsreducer.html#add_alert) reducers and [epic](./alertepic.html#add_alert)
   * @returns Removes the alert from conveyor.alerts in state
   */
  [DISMISS_ALERT](state: any, action: any) {
    return state.filter(
      (obj: any) =>
        R.prop('expiresOn', obj) > R.prop('expiresOn', action.payload)
    )
  }
}
