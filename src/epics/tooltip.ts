import * as R from 'ramda'
import { ofType } from 'redux-observable'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import { FETCH_MODEL_TOOLTIP } from '../actionConsts'
import * as Logger from '../utils/Logger'
import { Epic } from './epic'
import { EpicPayload } from '../types'

/**
 * A class containing epics handling tooltips
 */
export class TooltipEpic extends Epic {
  /**
   * Dispatched whenever displaying a tooltip.
   * @param action$ object {type: string, payload: {modelName: string, id: string}}
   * @returns - Actions.[updateModelTooltip](./tooltipreducer.html#update_model_tooltip)({modelName: string, id: string, data: object})
   */
  [FETCH_MODEL_TOOLTIP](action$: any) {
    return action$.pipe(
      ofType(FETCH_MODEL_TOOLTIP),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const variables = { id: payload.id }
        const query = this.queryTool.buildQuery({
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
        return this.queryTool
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
