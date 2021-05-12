import * as R from 'ramda'
import { ofType } from 'redux-observable'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import { FETCH_MODEL_TOOLTIP } from '../actionConsts'
import * as Logger from '../utils/Logger'
import { Epic } from './epic'
import { EpicPayload } from '../types'

export class TooltipEpic extends Epic {
  [FETCH_MODEL_TOOLTIP](action$: any) {
    return action$.pipe(
      ofType(FETCH_MODEL_TOOLTIP),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const variables = { id: payload.id }
        const query = this.queryBuilder.buildQuery({
          modelName: payload.modelName,
          queryType: 'tooltip'
        })
        return {
          modelName: payload.modelName,
          id: payload.id,
          query,
          variables
        }
      }),
      mergeMap((context: any) => {
        return this.queryBuilder
          .sendRequest({ query: context.query, variables: context.variables })
          .then(({ data, error }) => ({ context, data, error }))
      }),
      map(
        ({ context, data, error }: { context: any; data: any; error: any }) => {
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
        }
      )
    )
  }
}
