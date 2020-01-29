import { ofType } from 'redux-observable'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import * as consts from '../actionConsts'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'

export const generateFetchTooltipEpic = (schema, doRequest) => (
  action$,
  state$
) =>
  action$.pipe(
    ofType(consts.FETCH_MODEL_TOOLTIP),
    map(R.prop('payload')),
    map(payload => {
      const variables = { id: payload.id }
      const query = doRequest.buildQuery(payload.modelName, 'tooltip')
      return { modelName: payload.modelName, id: payload.id, query, variables }
    }),
    mergeMap(context => {
      return doRequest
        .sendRequest(context.query, context.variables)
        .then(({ data, error }) => ({ context, data, error }))
    }),
    map(({ context, data, error }) => {
      if (error) {
        Logger.epicError('fetchModelTooltipEpic', context, error)
        return Actions.addDangerAlert({
          message: `Error loading ${context.modelName} tooltip`
        })
      }

      return Actions.updateModelTooltip({
        modelName: context.modelName,
        id: context.id,
        data
      })
    })
  )
