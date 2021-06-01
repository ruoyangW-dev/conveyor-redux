import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import * as R from 'ramda'
import * as Actions from '../actions'
import {
  INDEX_TABLE_FILTER_SUBMIT,
  INDEX_TABLE_SORT_CHANGE
} from '../actionConsts'
import { Epic } from './epic'

/**
 * A class containing epics handling index table actions
 */
export class IndexTableEpic extends Epic {
  /**
   * Dispatched after applying filter rules.
   * @param action$ object {type: string, payload: {modelName: string}}
   * @returns - Action [fetchModelIndex](./modelepic.html#fetch_model_index)({modelName})
   */
  [INDEX_TABLE_FILTER_SUBMIT](action$: any) {
    return action$.pipe(
      ofType(INDEX_TABLE_FILTER_SUBMIT),
      map(R.path(['payload', 'modelName'])),
      map((modelName) => Actions.fetchModelIndex({ modelName }))
    )
  }

  /**
   * Called changing the sorting of a table.
   * @param action$ object {type: string, payload: {modelName: string, fieldName: string}}
   * @returns [fetchModelIndex](./modelepic.html#fetch_model_index)
   */
  [INDEX_TABLE_SORT_CHANGE](action$: any) {
    return action$.pipe(
      ofType(INDEX_TABLE_SORT_CHANGE),
      map(R.path(['payload', 'modelName'])),
      map((modelName) => Actions.fetchModelIndex({ modelName }))
    )
  }
}
