import * as R from 'ramda'
import { UPDATE_DELETE_DETAIL, CANCEL_DELETE_DETAIL } from '../actionConsts'
import { initState, groupModels } from '../utils/modal'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import { Config } from '../types'

/**
 * Class containing reducers handling modals
 */
export class ModalReducer extends Reducer {
  /**
   * Creates a reducer object that can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   * @param config Custom user inputted configurations
   */
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }

  /**
   * Dispatched by [fetchDeleteDetail](./modalepic.html#fetch_delete_detail)
   * @param state Redux state
   * @param action object {type: string, payload: {data: [{__typename: string, id: string, fieldName: string}, ]}}
   * @returns Updates conveyor.modal.Delete with payload.data in state
   */
  [UPDATE_DELETE_DETAIL](state: any, action: any) {
    const deletes = R.path(['payload', 'data'], action)
    const groupedData = groupModels(deletes, '__typename')
    return { ...state, Delete: groupedData }
  }

  /**
   * Dispatched when submitting cancel on the Delete modal
   * @param state Redux state
   * @returns Sets value of conveyor.modal.Delete to null in state
   */
  [CANCEL_DELETE_DETAIL](state: any) {
    return { ...state, Delete: undefined }
  }
}
