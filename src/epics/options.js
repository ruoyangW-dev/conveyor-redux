import { getSort } from '../utils/epicHelpers'
import { concat } from 'rxjs'
import { map, mergeMap, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import * as Actions from '../actions'
import * as consts from '../actionConsts'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'

export const generateQuerySelectMenuOpenEpic = (schema, doRequest) => (
  action$
) =>
  action$.pipe(
    ofType(consts.QUERY_SELECT_MENU_OPEN),
    map(R.prop('payload')),
    map(payload => {
      const modelName = R.prop('modelName', payload)
      const fieldName = R.prop('fieldName', payload)
      const variables = {
        modelName: payload.modelName,
        fieldName: payload.fieldName
      }

      return { variables, modelName, fieldName }
    }),
    mergeMap(context => {
      const query = doRequest.buildQuery({ modelName: context.modelName, queryType: 'index' })

      return doRequest
        .sendRequest({ query, variables: context.variables })
        .then(({ data, error }) => ({
          context,
          data,
          error
        }))
    }),
    map(({ context, data, error }) => {
      if (error) {
        Logger.epicError('querySelectMenuOpenEpic', context, error)

        return Actions.addDangerAlert({ message: 'Error loading form option.' })
      }

      return Actions.existingValueUpdate({
        modelName: context.modelName,
        fieldName: context.fieldName,
        value: R.prop('result', data)
      })
    })
  )

export const generateRelationshipSelectMenuOpenEpic = (schema, doRequest) => (
  action$
) =>
  action$.pipe(
    ofType(consts.RELATIONSHIP_SELECT_MENU_OPEN),
    map(R.prop('payload')),
    map(payload => {
      const modelName = R.prop('modelName', payload)
      const fieldName = R.prop('fieldName', payload)
      const field = R.path([modelName, 'fields', fieldName], schema)
      const targetModel = R.path(['type', 'target'], field)
      const variables = {
        sort: getSort({ schema, modelName: targetModel })
      }

      return { variables, modelName, fieldName, targetModel }
    }),
    mergeMap(context => {
      const query = doRequest.buildQuery({ modelName: context.targetModel, queryType: 'select' })

      return doRequest
        .sendRequest({ query, variables: context.variables })
        .then(({ data, error }) => ({ context, data, error }))
    }),
    switchMap(({ context, data, error }) => {
      if (error) {
        Logger.epicError('relationshipSelectMenuOpenEpic', context, error)

        return Actions.addDangerAlert({ message: 'Error loading form option.' })
      }

      return concat([
        Actions.dataOptionsUpdate({
          modelName: context.modelName,
          fieldName: context.fieldName,
          value: R.prop('result', data)
        }),
        Actions.updateModelIndex({ modelName: context.targetModel, data })
      ])
    })
  )
