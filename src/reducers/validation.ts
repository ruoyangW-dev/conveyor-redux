import { initState } from '../utils/validation'
import {
  UPDATE_VALIDATION_RESULTS,
  CLEAR_VALIDATION_RESULTS,
  STACK_CREATE,
  DETAIL_CREATE,
  INDEX_CREATE,
  TABLE_EDIT_CANCEL,
  DETAIL_TABLE_EDIT_SUBMIT,
  ATTRIBUTE_EDIT_CANCEL,
  FETCH_MODEL_INDEX,
  FETCH_MODEL_DETAIL,
} from '../actionConsts'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import * as R from 'ramda'
import { Config } from '../types'

function clear_results(state: any, action: any) {
  return initState
}

export class ValidationReducer extends Reducer {
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }

  [UPDATE_VALIDATION_RESULTS](state: any, action: any) {
    return action.payload
  }
  [CLEAR_VALIDATION_RESULTS] = clear_results;
  [STACK_CREATE] = clear_results;
  [DETAIL_CREATE] = clear_results;
  [INDEX_CREATE] = clear_results;
  [TABLE_EDIT_CANCEL] = clear_results;
  [DETAIL_TABLE_EDIT_SUBMIT] = clear_results;
  [ATTRIBUTE_EDIT_CANCEL] = clear_results;
  [FETCH_MODEL_INDEX] = clear_results;
  [FETCH_MODEL_DETAIL] = clear_results;
}
