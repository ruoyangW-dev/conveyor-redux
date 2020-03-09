import * as R from 'ramda'
import { LOCATION_CHANGE } from 'connected-react-router'
import { ofType } from 'redux-observable'
import { concat } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { getPath, pathFunctions } from '../utils/helpers'
import { Epic } from './epic'

export class RouteEpic extends Epic {
  [LOCATION_CHANGE](action$, state$) {
    return action$.pipe(
      ofType(LOCATION_CHANGE),
      map(getPath),
      switchMap(path => {
        const state = state$.value
        const actions = R.pipe(
          R.ap(pathFunctions),
          R.reject(R.equals(undefined)),
          R.flatten
        )([{ path, schema: this.schema, state }])
        return concat(actions)
      })
    )
  }
}
