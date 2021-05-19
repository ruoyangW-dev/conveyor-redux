import * as R from 'ramda'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Config } from '../types'

export class Reducer {
  schema: SchemaBuilder
  initState: any
  config: Config

  constructor(schema: SchemaBuilder, initState: any, config: Config) {
    this.schema = schema
    this.initState = initState
    this.config = config
  }

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
