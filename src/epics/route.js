import { LOCATION_CHANGE } from 'connected-react-router'
import { ofType } from 'redux-observable'
import { concat } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { getHasIndex, getHasDetail } from 'conveyor'
import * as R from 'ramda'
import * as Actions from '../actions'

const isModelPathPrefix = (path, schema) => (
  (path.length >= 2) && (path[0] === '') && (R.propOr(false, path[1])) && (getHasIndex(schema, path[1]) || getHasDetail(schema, path[1]))
)

const modelIndexPath = ({ path, schema }) => {
  if ((path.length === 2) && isModelPathPrefix(path, schema)) {
    const modelName = path[1]

    if (getHasIndex(schema, modelName)) {
      return [
        Actions.fetchModelIndex({ modelName })
      ]
    }
  }
}

const modelDetailPath = ({ path, state, schema }) => {
  if ((path.length >= 3) && isModelPathPrefix(path, schema) && (path[2] !== 'create')) {
    return [
      Actions.fetchModelDetail({ modelName: path[1], id: path[2] })
    ]
  }
}

const modelCreatePath = ({ path, schema }) => {
  if ((path.length === 3) && isModelPathPrefix(path) && (path[2] === 'create')) {
    return []
  }
}

const pathFunctions = [
  modelIndexPath,
  modelDetailPath,
  modelCreatePath
]

const getPath = locationChangeAction => R.pipe(
  R.pathOr('', ['payload', 'location', 'pathname']),
  pathname => pathname.split('/'),
  R.dropLastWhile(R.equals(''))
)(locationChangeAction)

export const generateRouteEpic = (schema, doRequest) => (action$, state$) => action$.pipe(
  ofType(LOCATION_CHANGE),
  map(getPath),
  switchMap(path => {
    const state = state$.value
    const actions = R.pipe(
      R.ap(pathFunctions),
      R.reject(R.equals(undefined)),
      R.flatten
    )([{ path, state }])
    return concat(actions)
  })
)