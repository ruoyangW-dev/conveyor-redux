import * as R from 'ramda'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

export class Reducer {
  schema: SchemaBuilder
  initState: any

  constructor(schema: SchemaBuilder, initState: any) {
    this.schema = schema
    this.initState = initState
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
