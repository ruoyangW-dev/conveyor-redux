import { LOCATION_CHANGE } from 'connected-react-router'
import { ofType } from 'redux-observable'
import { concat } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import * as R from 'ramda'
import * as Actions from '../actions'

const isModelPathPrefix = (path, schema) =>
  path.length >= 2 &&
  path[0] === '' &&
  R.propOr(false, path[1]) &&
  (schema.getHasIndex(path[1]) || schema.getHasDetail(path[1]))

const modelIndexPath = ({ path, schema }) => {
  if (path.length === 2 && isModelPathPrefix(path, schema)) {
    const modelName = path[1]

    // getHasIndex() may return true by default => must check if modelName str in JSON object
    if (schema.getHasIndex(modelName) && (modelName in schema.schemaJSON)) {
      return [Actions.fetchModelIndex({ modelName })]
    }
  }
}

const modelDetailPath = ({ path, schema }) => {
  if (
    path.length >= 3 &&
    isModelPathPrefix(path, schema) &&
    path[2] !== 'create'
  ) {
    return [Actions.fetchModelDetail({ modelName: path[1], id: path[2] })]
  }
}

const modelCreatePath = ({ path }) => {
  if (path.length === 3 && isModelPathPrefix(path) && path[2] === 'create') {
    return []
  }
}

const pathFunctions = [modelIndexPath, modelDetailPath, modelCreatePath]

const getPath = locationChangeAction =>
  R.pipe(
    R.pathOr('', ['payload', 'location', 'pathname']),
    pathname => pathname.split('/'),
    R.dropLastWhile(R.equals(''))
  )(locationChangeAction)

export const generateRouteEpic = () => (action$, state$) =>
  action$.pipe(
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

