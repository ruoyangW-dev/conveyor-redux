import * as Actions from '../actions'
import * as consts from '../actionConsts'
import * as R from 'ramda'
import { getFilters, getSort } from '../utils/helpers'
import { map, mergeMap, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { selectTableView } from '../utils/tableView'
import { getModelLabel } from '@autoinvent/conveyor'
import { concat } from 'rxjs'
import * as Logger from '../utils/Logger'

const getDeleteErrors = ({ data, context }) =>
  R.path(['delete' + context.modelName, 'errors'], data)

export const generateFetchModelIndexEpic = (schema, doRequest) => (
  action$,
  state$
) =>
  action$.pipe(
    ofType(consts.FETCH_MODEL_INDEX),
    map(R.prop('payload')),
    map(payload => {
      const variables = {
        filter: getFilters({
          schema,
          modelName: payload.modelName,
          tableView: selectTableView(state$.value)
        }),
        sort: getSort({
          schema,
          modelName: payload.modelName,
          tableView: selectTableView(state$.value)
        })
      }
      return { modelName: payload.modelName, variables }
    }),
    mergeMap(context => {
      const query = doRequest.buildQuery({
        modelName: context.modelName,
        queryType: 'index'
      })
      return doRequest
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

export const generateFetchModelDetailEpic = (schema, doRequest) => action$ =>
  action$.pipe(
    ofType(consts.FETCH_MODEL_DETAIL),
    map(R.prop('payload')),
    map(payload => {
      const variables = { id: payload.id }
      return { modelName: payload.modelName, id: payload.id, variables }
    }),
    mergeMap(context => {
      const query = doRequest.buildQuery({
        modelName: context.modelName,
        queryType: 'detail'
      })
      return doRequest
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

export const generateRequestDeleteModelEpic = (schema, doRequest) => action$ =>
  action$.pipe(
    ofType(consts.REQUEST_DELETE_MODEL),
    map(R.prop('payload')),
    map(payload => {
      const query = doRequest.buildQuery({
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
      doRequest
        .sendRequest({
          query: context.query,
          variables: context.variables
        })
        .then(({ data, error }) => ({ context, data, error }))
    ),
    switchMap(({ context, data, error }) => {
      const displayName = getModelLabel({
        schema,
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

// deletes child, then fetchs parent detail
export const generateRequestDeleteRelTableModelEpic = (
  schema,
  doRequest
) => action$ =>
  action$.pipe(
    ofType(consts.REQUEST_DELETE_REL_TABLE_MODEL),
    map(R.prop('payload')),
    map(payload => {
      const query = doRequest.buildQuery({
        modelName: payload.modelName,
        queryType: 'delete'
      })
      const variables = { id: payload.id }
      return { ...payload, query, variables }
    }),
    mergeMap(context =>
      doRequest
        .sendRequest({
          query: context.query,
          variables: context.variables
        })
        .then(({ data, error }) => ({ context, data, error }))
    ),
    switchMap(({ context, data, error }) => {
      const displayName = getModelLabel({
        schema,
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
          Actions.addDangerAlert({ message: `Error deleting ${displayName}.` })
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

export const generateRequestDeleteModelFromDetailPageEpic = (
  schema,
  doRequest
) => action$ =>
  action$.pipe(
    ofType(consts.REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE),
    map(R.prop('payload')),
    map(payload => {
      const query = doRequest.buildQuery({
        modelName: payload.modelName,
        queryType: 'delete'
      })
      const variables = { id: payload.id }
      return { modelName: payload.modelName, id: payload.id, query, variables }
    }),
    mergeMap(context =>
      doRequest
        .sendRequest({
          query: context.query,
          variables: context.variables
        })
        .then(({ data, error }) => ({ context, data, error }))
    ),
    switchMap(({ context, data, error }) => {
      const displayName = getModelLabel({
        schema,
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
        Logger.epicError('requestDeleteModelFromDetailPageEpic', context, error)
        return concat([
          Actions.addDangerAlert({ message: `Error deleting ${displayName}.` })
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
