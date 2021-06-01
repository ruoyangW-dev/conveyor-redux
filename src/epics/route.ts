import * as R from 'ramda'
import { LOCATION_CHANGE } from 'connected-react-router'
import { ofType } from 'redux-observable'
import { concat } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { getPath, pathFunctions } from '../utils/helpers'
import { Epic } from './epic'

/**
 * A class of epics for handling routing with [React-Router](https://reactrouter.com/web/guides/quick-start).
 */
export class RouteEpic extends Epic {
  /**
   * Implementation of [connected-react-router](https://github.com/supasate/connected-react-router)'s *LOCATION_CHANGE* 
   * which is dispatched each time the URL is changed.
   * @param action$ object {type: string, payload: {location: object, action: string, isFirstRendering: boolean}}
   * @returns [object {type: string, payload: object}, ]
   */
  [LOCATION_CHANGE](action$: any) {
    return action$.pipe(
      ofType(LOCATION_CHANGE),
      map(getPath),
      switchMap((path) => {
        const pipeActions: (obArray: [object]) => [object] = R.pipe(
          R.ap(pathFunctions),
          // @ts-ignore
          R.reject(R.equals(undefined)),
          R.flatten
        )
        const actions = pipeActions([{ path, schema: this.schema }])
        return concat(actions)
      })
    )
  }
}
