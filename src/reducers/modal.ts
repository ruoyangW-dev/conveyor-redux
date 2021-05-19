import * as R from 'ramda'
import { UPDATE_DELETE_DETAIL, CANCEL_DELETE_DETAIL } from '../actionConsts'
import { initState, groupModels } from '../utils/modal'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import { Config } from '../types'

export class ModalReducer extends Reducer {
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }

  [UPDATE_DELETE_DETAIL](state: any, action: any) {
    const deletes = R.path(['payload', 'data'], action)
    const groupedData = groupModels(deletes, '__typename')
    return { ...state, Delete: groupedData }
  }

  [CANCEL_DELETE_DETAIL](state: any) {
    return { ...state, Delete: undefined }
  }
}
