import { initState } from '../utils/darkMode'
import { TOGGLE_DARK_MODE } from '../actionConsts'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import * as R from 'ramda'

export class DarkModeReducer extends Reducer {
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }
  [TOGGLE_DARK_MODE](state: boolean) {
    // @ts-ignore
    return !state
  }
}
