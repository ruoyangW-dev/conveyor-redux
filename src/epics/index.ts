import { combineEpics } from 'redux-observable'
import { catchError } from 'rxjs/operators'
import { AlertEpic } from './alert'
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
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import type { QueryTool } from '../types'
import * as Actions from '../actions'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'
import { Config } from '../types'

const conveyorEpics = [
  AlertEpic,
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
  schema: SchemaBuilder
  queryTool: QueryTool
  config: Config

  constructor(
    schema: SchemaBuilder,
    queryTool: QueryTool,
    config: Config = {}
  ) {
    ;(this.schema = schema),
      (this.queryTool = queryTool),
      (this.config = config)
  }

  makeEpic(store: any) {
    return combineEpicsAndCatchErrors(
      store,
      ...R.flatten(
        R.map(
          (Epic) =>
            new Epic(this.schema, this.queryTool, this.config).makeEpic(),
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
export const combineEpicsAndCatchErrors =
  (store: any, ...epics: any) =>
  (action$: any, state$: any, dep: any) => {
    epics = epics.map(
      (epic: any) => (action$: any, state$: any) =>
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
