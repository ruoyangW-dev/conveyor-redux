import * as R from 'ramda'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Config } from '../types'

/**
 * The reducer class that each reducer category extends from. Can combine reducers into one.
 */
export class Reducer {
  /** [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema) */
  schema: SchemaBuilder
  /** The initial state of a reducer */
  initState: any
  /** User-inputted custom configurations */
  config: Config

  /**
   * Creates a reducer object in its initial state
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   * @param initState Initial state
   * @param config Custom user inputted configurations
   */
  constructor(schema: SchemaBuilder, initState: any, config: Config) {
    this.schema = schema
    this.initState = initState
    this.config = config
  }

  /**
   * Combines reducers
   * @param state Redux state
   * @param action object {type: string, payload?: object}
   * @returns Redux state
   */
  reduce(state: any, action: any) {
    if (R.isNil(state)) {
      state = this.initState
    }

    // @ts-ignore
    if (this && R.type(this[action.type]) === 'Function')
      // @ts-ignore
      return this[action.type](state, action)
    else return state
  }
}
