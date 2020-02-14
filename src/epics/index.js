import { combineEpics } from 'redux-observable'
import { catchError } from 'rxjs/operators'
import {
  generateFetchModelIndexEpic,
  generateFetchModelDetailEpic,
  generateRequestDeleteModelEpic,
  generateRequestDeleteModelFromDetailPageEpic,
  generateRequestDeleteRelTableModelEpic
} from './model'
import {
  generateRelationshipSelectMenuOpenEpic,
  generateQuerySelectMenuOpenEpic
} from './options'
import { generateRouteEpic } from './route'
import {
  generateFetchSearchEntriesEpic,
  generateSearchQuerySubmitEpic
} from './search'
import {
  generateIndexTableFilterChangeEpic,
  generateIndexTableSortChangeEpic
} from './indexTable'
import { generateFetchTooltipEpic } from './tooltip'
import {
  generateDetailAttributeEditSubmitEpic,
  generateDetailTableEditSubmitEpic,
  generateDetailTableRemoveSubmitEpic,
  generateIndexEditSubmitEpic,
  generateInlineFileDeleteEpic
} from './edit'
import { generateSaveCreateEpic } from './create'
import * as Actions from '../actions'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'

export const generateConveyorEpics = (schema, doRequest) => {
  const fetchModelIndexEpic = generateFetchModelIndexEpic(schema, doRequest)
  const fetchModelDetailEpic = generateFetchModelDetailEpic(schema, doRequest)
  const fetchSearchEntriesEpic = generateFetchSearchEntriesEpic(
    schema,
    doRequest
  )
  const indexFilterEpic = generateIndexTableFilterChangeEpic(schema, doRequest)
  const indexSortEpic = generateIndexTableSortChangeEpic(schema, doRequest)
  const querySelectMenuOpenEpic = generateQuerySelectMenuOpenEpic(
    schema,
    doRequest
  )
  const relationshipSelectMenuOpenEpic = generateRelationshipSelectMenuOpenEpic(
    schema,
    doRequest
  )
  const routeEpic = generateRouteEpic(schema, doRequest)
  const searchQuerySubmitEpic = generateSearchQuerySubmitEpic(schema, doRequest)
  const tooltipEpic = generateFetchTooltipEpic(schema, doRequest)
  const detailAttributeEditSubmitEpic = generateDetailAttributeEditSubmitEpic(
    schema,
    doRequest
  )
  const detailTableEditSubmitEpic = generateDetailTableEditSubmitEpic(
    schema,
    doRequest
  )
  const detailTableRemoveSubmitEpic = generateDetailTableRemoveSubmitEpic(
    schema,
    doRequest
  )
  const indexEditSubmitEpic = generateIndexEditSubmitEpic(schema, doRequest)
  const inlineFileDeleteEpic = generateInlineFileDeleteEpic(schema, doRequest)
  const saveCreateEpic = generateSaveCreateEpic(schema, doRequest)
  const requestDeleteModelEpic = generateRequestDeleteModelEpic(
    schema,
    doRequest
  )
  const requestDeleteModelFromDetailPageEpic = generateRequestDeleteModelFromDetailPageEpic(
    schema,
    doRequest
  )
  const requestDeleteRelTableModelEpic = generateRequestDeleteRelTableModelEpic(
    schema,
    doRequest
  )

  return {
    fetchModelIndexEpic,
    fetchModelDetailEpic,
    fetchSearchEntriesEpic,
    indexFilterEpic,
    indexSortEpic,
    querySelectMenuOpenEpic,
    relationshipSelectMenuOpenEpic,
    routeEpic,
    searchQuerySubmitEpic,
    tooltipEpic,
    detailAttributeEditSubmitEpic,
    detailTableEditSubmitEpic,
    detailTableRemoveSubmitEpic,
    indexEditSubmitEpic,
    inlineFileDeleteEpic,
    saveCreateEpic,
    requestDeleteModelEpic,
    requestDeleteModelFromDetailPageEpic,
    requestDeleteRelTableModelEpic
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
            message: 'An error has occurred while combining epics.'
          })
        )
        return caught
      })
    )
  )
  return combineEpics(...epics)(action$, state$)
}
