import * as R from 'ramda'
import { initState, handleError } from '../utils/alerts'
import { ADD_DANGER_ALERT } from '../actionConsts'

export class AlertsReducer {
  constructor(schema) {
    this.schema = schema
  }

  [ADD_DANGER_ALERT](state, action) {
    return [...state, handleError({ payload: action.payload, type: 'danger' })]
  }

  reduce(state = initState, action) {
    if (this && R.type(this[action.type]) === 'Function')
      return this[action.type](state, action)
    else return state
  }
}
