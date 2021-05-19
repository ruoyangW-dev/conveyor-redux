import { initState } from '../utils/userPreferences'
import { TOGGLE_DARK_MODE } from '../actionConsts'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import * as R from 'ramda'
import { Config } from '../types'

export class UserPreferencesReducer extends Reducer {
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }
  [TOGGLE_DARK_MODE](state: any) {
    // @ts-ignore
    return R.assoc('darkMode', !R.prop('darkMode', state), state)
  }
}
