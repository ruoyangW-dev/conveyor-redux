import { combineEpics } from 'redux-observable'
import { catchError } from 'rxjs/operators'
import { ModelEpic } from './model'
import { OptionsEpic } from './options'
import { RouteEpic } from './route'
import { SearchEpic } from './search'
import { IndexTableEpic } from './indexTable'
import { TooltipEpic } from './tooltip'
import { EditEpic } from './edit'
import { ValidationEpic } from './validation'
import { CreateEpic } from './create'
import { ModalEpic } from './modal'
import * as Actions from '../actions'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'

const conveyorEpics = [
  CreateEpic,
  EditEpic,
  IndexTableEpic,
  ModalEpic,
  ModelEpic,
  OptionsEpic,
  RouteEpic,
  SearchEpic,
  TooltipEpic,
  ValidationEpic
]

export class ConveyorEpic {
  constructor(schema, doRequest) {
    this.schema = schema
    this.doRequest = doRequest
  }

  makeEpic(store) {
    return combineEpicsAndCatchErrors(
      store,
      ...R.flatten(
        R.map(
          Epic => new Epic(this.schema, this.doRequest).makeEpic(),
          conveyorEpics
        )
      )
    )
  }
}

/**
 * Combine epics together and catch any errors when creating the root epic.
 * If there are any errors it will log it and add the error to the store.
 * credit: https://github.com/redux-observable/redux-observable/issues/94#issuecomment-396763936
 * @param store - the store of the application
 * @param epics - an object containing all the epics to be combined
 * @return The combined epics
 */
export const combineEpicsAndCatchErrors = (store, ...epics) => (
  action$,
  state$,
  dep
) => {
  epics = epics.map(epic => (action$, state$) =>
    epic(action$, state$, dep).pipe(
      catchError((error, caught) => {
        const epicName = R.prop('name', epic)
        Logger.rootEpicError(epicName, error)
        store.dispatch(
          Actions.addDangerAlert({
            message: `An error has occurred in the ${epicName}.`
          })
        )
        return caught
      })
    )
  )
  return combineEpics(...epics)(action$, state$)
}
