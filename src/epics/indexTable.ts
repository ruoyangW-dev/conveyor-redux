import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import * as R from 'ramda'
import * as Actions from '../actions'
import {
  INDEX_TABLE_FILTER_SUBMIT,
  INDEX_TABLE_SORT_CHANGE
} from '../actionConsts'
import { Epic } from './epic'

export class IndexTableEpic extends Epic {
  [INDEX_TABLE_FILTER_SUBMIT](action$: any) {
    return action$.pipe(
      ofType(INDEX_TABLE_FILTER_SUBMIT),
      map(R.path(['payload', 'modelName'])),
      map(modelName => Actions.fetchModelIndex({ modelName }))
    )
  }

  [INDEX_TABLE_SORT_CHANGE](action$: any) {
    return action$.pipe(
      ofType(INDEX_TABLE_SORT_CHANGE),
      map(R.path(['payload', 'modelName'])),
      map(modelName => Actions.fetchModelIndex({ modelName }))
    )
  }
}
