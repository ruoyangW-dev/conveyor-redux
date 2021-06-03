import { ofType } from 'redux-observable'
import * as R from 'ramda'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import { FETCH_DELETE_DETAIL } from '../actionConsts'
import * as Logger from '../utils/Logger'
import { Epic } from './epic'
import { EpicPayload } from '../types'

/**
 * A class containing epics handling modal actions
 */
export class ModalEpic extends Epic {
  /**
   * Dispatched when deleting an instance from Index or Detail page. Fetches data to display on Delete modal.
   * @param action$ object {type: string, payload: {modelName: string, id: string}}
   * @return - Actions.[updateDeleteDetail](./modalreducer.html#update_delete_detail)({data})
   */
  [FETCH_DELETE_DETAIL](action$: any) {
    return action$.pipe(
      ofType(FETCH_DELETE_DETAIL),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const query = this.queryTool.buildQuery({
          modelName: payload.modelName,
          queryType: 'deleteCascades'
        })
        const variables = { modelName: payload.modelName, id: payload.id }
        return {
          modelName: payload.modelName,
          id: payload.id,
          query,
          variables
        }
      }),
      mergeMap((context: any) =>
        this.queryTool
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      map(
        ({ context, data, error }: { context: any; data: any; error: any }) => {
          if (error) {
            Logger.epicError('fetchDeleteDetailEpic', context, error)
            return Actions.addDangerAlert({
              message: `Error loading ${context.modelName} delete detail.`
            })
          }

          return Actions.updateDeleteDetail({ data })
        }
      )
    )
  }
}
