import * as Actions from '../actions'
import {
  FETCH_MODEL_INDEX,
  FETCH_MODEL_DETAIL,
  REQUEST_DELETE_MODEL,
  REQUEST_DELETE_REL_TABLE_MODEL,
  REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE
} from '../actionConsts'
import * as R from 'ramda'
import { getFilters, getSort, getDeleteErrors } from '../utils/helpers'
import { map, mergeMap, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { selectTableView } from '../utils/tableView'
import { concat } from 'rxjs'
import * as Logger from '../utils/Logger'
import { Epic } from './epic'

export class ModelEpic extends Epic {
  [FETCH_MODEL_INDEX](action$, state$) {
    return action$.pipe(
      ofType(FETCH_MODEL_INDEX),
      map(R.prop('payload')),
      map(payload => {
        const variables = {
          filter: getFilters({
            schema: this.schema,
            modelName: payload.modelName,
            tableView: selectTableView(state$.value)
          }),
          sort: getSort({
            schema: this.schema,
            modelName: payload.modelName,
            tableView: selectTableView(state$.value)
          })
        }
        return { modelName: payload.modelName, variables }
      }),
      mergeMap(context => {
        const query = this.doRequest.buildQuery({
          modelName: context.modelName,
          queryType: 'index'
        })
        return this.doRequest
          .sendRequest({ query, variables: context.variables })
          .then(({ data, error }) => ({ context, data, error }))
      }),
      map(({ context, data, error }) => {
        if (error) {
          return Actions.addDangerAlert({
            message: `Error loading ${context.modelName} index.`
          })
        }
        return Actions.updateModelIndex({ modelName: context.modelName, data })
      })
    )
  }

  [FETCH_MODEL_DETAIL](action$) {
    return action$.pipe(
      ofType(FETCH_MODEL_DETAIL),
      map(R.prop('payload')),
      map(payload => {
        const variables = { id: payload.id }
        return { modelName: payload.modelName, id: payload.id, variables }
      }),
      mergeMap(context => {
        const query = this.doRequest.buildQuery({
          modelName: context.modelName,
          queryType: 'detail'
        })
        return this.doRequest
          .sendRequest({ query, variables: context.variables })
          .then(({ data, error }) => ({ context, data, error }))
      }),
      map(({ context, data, error }) => {
        if (error) {
          return Actions.addDangerAlert({
            message: `Error loading ${context.modelName} details.`
          })
        }
        return Actions.updateModelDetail({
          modelName: context.modelName,
          id: context.id,
          data
        })
      })
    )
  }

  [REQUEST_DELETE_MODEL](action$) {
    return action$.pipe(
      ofType(REQUEST_DELETE_MODEL),
      map(R.prop('payload')),
      map(payload => {
        const query = this.doRequest.buildQuery({
          modelName: payload.modelName,
          queryType: 'delete'
        })
        const variables = { id: payload.id }
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
      switchMap(({ context, data, error }) => {
        // todo: pass 'node' and 'data' props
        const displayName = this.schema.getModelLabel({
          modelName: context.modelName
        })

        // get errors from context
        const errors = getDeleteErrors({ data, context })
        if (errors) {
          Logger.epicError('requestDeleteModelEpic', context, error)
          const contactErrors = R.join('. ', errors)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}. ${contactErrors}`
            })
          ])
        }

        // get errors from 'error' prop
        if (error) {
          Logger.epicError('requestDeleteModelEpic', context, error)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}.`
            })
          ])
        }

        return concat([
          Actions.updateDeleteModel({
            modelName: context.modelName,
            id: context.id
          }),
          Actions.addSuccessAlert({
            message: `${displayName} was successfully deleted.`
          })
        ])
      })
    )
  }

  [REQUEST_DELETE_REL_TABLE_MODEL](action$) {
    return action$.pipe(
      ofType(REQUEST_DELETE_REL_TABLE_MODEL),
      map(R.prop('payload')),
      map(payload => {
        const query = this.doRequest.buildQuery({
          modelName: payload.modelName,
          queryType: 'delete'
        })
        const variables = { id: payload.id }
        return { ...payload, query, variables }
      }),
      mergeMap(context =>
        this.doRequest
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      switchMap(({ context, data, error }) => {
        // todo: pass node and data props in
        const displayName = this.schema.getModelLabel({
          modelName: context.modelName
        })

        // get errors from context
        const errors = getDeleteErrors({ data, context })
        if (errors) {
          Logger.epicError('requestDeleteModelEpic', context, error)
          const contactErrors = R.join('. ', errors)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}. ${contactErrors}`
            })
          ])
        }

        if (error) {
          Logger.epicError('requestDeleteRelTableModelEpic', context, error)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}.`
            })
          ])
        }

        return concat([
          Actions.fetchModelDetail({
            modelName: context.parentModel,
            id: context.parentId
          }),
          Actions.addSuccessAlert({
            message: `${displayName} was successfully deleted.`
          })
        ])
      })
    )
  }

  [REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE](action$) {
    return action$.pipe(
      ofType(REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE),
      map(R.prop('payload')),
      map(payload => {
        const query = this.doRequest.buildQuery({
          modelName: payload.modelName,
          queryType: 'delete'
        })
        const variables = { id: payload.id }
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
      switchMap(({ context, data, error }) => {
        // todo: pass node and data props in
        const displayName = this.schema.getModelLabel({
          modelName: context.modelName
        })

        // get errors from context
        const errors = getDeleteErrors({ data, context })
        if (errors) {
          Logger.epicError('requestDeleteModelEpic', context, error)
          const contactErrors = R.join('. ', errors)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}. ${contactErrors}`
            })
          ])
        }

        if (error) {
          Logger.epicError(
            'requestDeleteModelFromDetailPageEpic',
            context,
            error
          )
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}.`
            })
          ])
        }

        return concat([
          Actions.removeInstance({
            modelName: context.modelName,
            id: context.id
          }),
          Actions.addSuccessAlert({
            message: `${displayName} was successfully deleted.`
          })
        ])
      })
    )
  }
}
