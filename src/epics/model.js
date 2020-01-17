import * as Actions from '../actions'
import * as consts from '../actionConsts'
import * as R from 'ramda'
import { getFields, inputTypes, getInputType, isRel } from 'conveyor'
import { selectTableView } from '../reducers/tableView'
import { ofType } from 'redux-observable'
import { map, mergeMap } from 'rxjs/operators'

const getFilters = ({ schema, modelName, tableView }) => {
  const fields = getFields(schema, modelName)
  const getFieldFilter = field => {
    const fieldName = R.prop('fieldName', field)
    const operator = R.path(['filter', modelName, fieldName, 'operator', 'value'], tableView)
    const value = R.path(['filter', modelName, fieldName, 'value'], tableView)
    if (operator && field.type === inputTypes.BOOLEAN_TYPE) {
      return { operator, value: R.isNil(value) ? false : value }
    }
    if (operator && !R.isNil(value) && !R.isEmpty(value)) {
      if (isRel(field)) {
        if (getInputType({ schema, modelName, fieldName }) === inputTypes.RELATIONSHIP_SINGLE) {
          return { operator, value: R.propOr(value, 'value', value) }
        }
        return { operator, value: value.map(val => val.value) }
      }
      if (field.type === inputTypes.ENUM_TYPE) {
        return { operator, value: value.value }
      }
      return { operator, value }
    }
    return undefined
  }
  let filters = R.map(getFieldFilter, fields)
  // filterFields: default filters, in addition filters set by user; always active
  const defaultFilters = R.path([modelName, 'filterFields'], schema)
  if (defaultFilters) {
    filters = R.merge(filters, defaultFilters)
  }
  return R.filter(R.identity, filters)
}
const getSort = ({ schema, modelName, tableView }) => {
  // get sort from user input
  if (tableView) {
    const sortKey = R.path(['sort', modelName, 'sortKey'], tableView)
    const fieldName = R.path(['sort', modelName, 'fieldName'], tableView)
    if (sortKey && fieldName) {
      return [`${fieldName}_${sortKey}`]
    }
  }
  // otherwise, get default sort from schema
  // sortFields: camel-case fields followed by '_asc' or '_desc'.
  return R.path([modelName, 'sortFields'], schema)
}

export const generateFetchModelIndexEpic = (schema, doRequest) => (action$, state$) => action$.pipe(
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
  mergeMap(context =>
    doRequest(context.modelName, context.variables, 'index').then(({ data, error }) => ({ context, data, error }))
  ),
  map(({ context, data, error }) => {
    if (error) {
      return Actions.errorLogger({ message: `Error loading ${context.modelName} index.` })
    }
    return Actions.updateModelIndex({ modelName: context.modelName, data })
  })
)

export const generateFetchDetailEpic = (schema, doRequest) => (action$, state$) => action$.pipe(
  ofType(consts.FETCH_MODEL_DETAIL),
  map(R.prop('payload')),
  map(payload => {
    const variables = { id: payload.id }
    return { modelName: payload.modelName, id: payload.id , variables }
  }),
  mergeMap(context =>
    doRequest(context.modelName, context.variables, 'detail').then(({ data, error }) => ({ context, data, error }))
  ),
  map(({ context, data, error }) => {
    if (error) {
      return Actions.errorLogger({ message: `Error loading ${context.modelName} details.` })
    }
    return Actions.updateModelIndex({ modelName: context.modelName, id: context.id, data })
  })
)