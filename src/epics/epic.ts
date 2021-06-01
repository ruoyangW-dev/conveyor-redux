import * as R from 'ramda'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import type { QueryTool, ROEpic } from '../types'

/**
 * The epic class that each Conveyor Epic types will extend from. 
 */
export class Epic {
  /** [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema) */
  schema: SchemaBuilder
  /** Tool for building and sending queries */
  queryTool: QueryTool

  /**
   * Creates an Epic object
   * @param schema [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   * @param queryTool Tool for building and sending queries
   */
  constructor(schema: SchemaBuilder, queryTool: QueryTool) {
    this.schema = schema
    this.queryTool = queryTool
  }

  /**
   * Creates epics
   * @returns List of epics
   */
  makeEpic() {
    const epics: ROEpic[] = []
    const methods = new Set()
    let obj: Record<string, any> = this //eslint-disable-line
    do {
      obj = Object.getPrototypeOf(obj)
      Object.getOwnPropertyNames(obj).forEach((name) => methods.add(name))
    } while (Object.getPrototypeOf(obj).constructor.name != 'Epic')
    R.forEach(
      (methodName) => {
        if (
          !R.includes(methodName, [
            'constructor',
            'makeEpic',
            '__reactstandin__regenerateByEval'
          ])
        ) {
          const epic: ROEpic = (action$, state$) =>
            // @ts-ignore
            this[methodName](action$, state$)
          Object.defineProperty(epic, 'name', { value: this.constructor.name })
          epics.push(epic)
        }
      },
      [...methods]
    )
    return epics
  }
}
