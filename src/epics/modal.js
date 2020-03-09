import { ofType } from 'redux-observable'
import * as R from 'ramda'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import { FETCH_DELETE_DETAIL } from '../actionConsts'
import * as Logger from '../utils/Logger'
import { Epic } from './epic'

export class ModalEpic extends Epic {
  [FETCH_DELETE_DETAIL](action$) {
    return action$.pipe(
      ofType(FETCH_DELETE_DETAIL),
      map(R.prop('payload')),
      map(payload => {
        const query = this.doRequest.buildQuery({
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
      mergeMap(context =>
        this.doRequest
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      map(({ context, data, error }) => {
        if (error) {
          Logger.epicError('fetchDeleteDetailEpic', context, error)
          return Actions.addDangerAlert({
            message: `Error loading ${context.modelName} delete detail.`
          })
        }

        return Actions.updateDeleteDetail({ data })
      })
    )
  }
}
