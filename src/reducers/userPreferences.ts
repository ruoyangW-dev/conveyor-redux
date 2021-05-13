import { initState } from '../utils/userPreferences'
import { TOGGLE_DARK_MODE } from '../actionConsts'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import * as R from 'ramda'

export class UserPreferencesReducer extends Reducer {
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }
  [TOGGLE_DARK_MODE](state: any) {
    // @ts-ignore
    return R.assoc('darkMode', !R.prop('darkMode', state), state)
  }
}
