import * as R from 'ramda'
import { UPDATE_DELETE_DETAIL, CANCEL_DELETE_DETAIL } from '../actionConsts'
import { initState, groupModels } from '../utils/modal'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'

export class ModalReducer extends Reducer {
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }

  [UPDATE_DELETE_DETAIL](state: any, action: any) {
    const deletes = R.path(['payload', 'data', 'checkDelete'], action)
    const groupedData = groupModels(deletes, '__typename')
    return { ...state, Delete: groupedData }
  }

  [CANCEL_DELETE_DETAIL](state: any) {
    return { ...state, Delete: undefined }
  }
}
