import { getSort } from '../utils/helpers'
import { concat } from 'rxjs'
import { map, mergeMap, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import * as Actions from '../actions'
import { QUERY_SELECT_MENU_OPEN, RELATIONSHIP_SELECT_MENU_OPEN } from '../actionConsts'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'
import { Epic } from './epic'

export class OptionsEpic extends Epic {
  [QUERY_SELECT_MENU_OPEN](action$) {
    return action$.pipe(
      ofType(QUERY_SELECT_MENU_OPEN),
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
        const query = this.doRequest.buildQuery({ modelName: context.modelName, queryType: 'index' })
  
        return this.doRequest
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
  }

  [RELATIONSHIP_SELECT_MENU_OPEN](action$) {
    return action$.pipe(
      ofType(RELATIONSHIP_SELECT_MENU_OPEN),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const fieldName = R.prop('fieldName', payload)
        const field = R.path([modelName, 'fields', fieldName], this.schema)
        const targetModel = R.path(['type', 'target'], field)
        const variables = {
          sort: getSort({ schema: this.schema, modelName: targetModel })
        }
  
        return { variables, modelName, fieldName, targetModel }
      }),
      mergeMap(context => {
        const query = this.doRequest.buildQuery({ modelName: context.targetModel, queryType: 'select' })
  
        return this.doRequest
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
  }
}
