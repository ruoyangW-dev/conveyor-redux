import { initState } from '../utils/userPreferences'
import { TOGGLE_DARK_MODE } from '../actionConsts'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import * as R from 'ramda'

/**
 * A class containing reducers handling user preferences
 */
export class UserPreferencesReducer extends Reducer {
  /**
   * Creates a reducer object that can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   */
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }

  /**
   * Dispatched when toggling dark mode
   * @param state Redux state
   * @returns Toggles conveyor.userPreferences.darkMode in state
   */
  [TOGGLE_DARK_MODE](state: any) {
    // @ts-ignore
    return R.assoc('darkMode', !R.prop('darkMode', state), state)
  }
}
