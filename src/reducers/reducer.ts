import * as R from 'ramda'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

/**
 * The reducer class that each reducer category extends from. Can combine reducers into one.
 */
export class Reducer {
  /** [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema) */
  schema: SchemaBuilder
  /** The initial state of a reducer */
  initState: any

  /**
   * Creates a reducer object in its initial state
   * @param schema 
   * @param initState 
   */
  constructor(schema: SchemaBuilder, initState: any) {
    this.schema = schema
    this.initState = initState
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
