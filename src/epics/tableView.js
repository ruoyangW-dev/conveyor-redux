import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import * as R from 'ramda'
import * as Actions from '../actions'
import * as consts from '../actionConsts'

export const generateIndexTableFilterChangeEpic = (
  schema,
  doRequest
) => action$ =>
  action$.pipe(
    ofType(consts.INDEX_TABLE_FILTER_SUBMIT),
    map(R.path(['payload', 'modelName'])),
    map(modelName => Actions.fetchModelIndex({ modelName }))
  )

export const generateIndexTableSortChangeEpic = (
  schema,
  doRequest
) => action$ =>
  action$.pipe(
    ofType(consts.INDEX_TABLE_SORT_CHANGE),
    map(R.path(['payload', 'modelName'])),
    map(modelName => Actions.fetchModelIndex({ modelName }))
  )
