import * as R from 'ramda'

export class Epic {
  constructor(schema, doRequest) {
    this.schema = schema
    this.doRequest = doRequest
  }

  makeEpic() {
    let epics = []
    R.forEach(methodName => {
      if (!R.includes(methodName, ['constructor', 'makeEpic'])) {
        const epic = (actions$, state$) => this[methodName](actions$, state$)
        Object.defineProperty(epic, 'name', { value: this.constructor.name })
        epics.push(epic)
      }
    }, Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
    return epics
  }
}