import { ofType } from 'redux-observable'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import { TRIGGER_SEARCH, FETCH_SEARCH_ENTRIES } from '../actionConsts'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'
import { Epic } from './epic'
import { EpicPayload } from '../types'

export class SearchEpic extends Epic {
  [TRIGGER_SEARCH](action$: any) {
    return action$.pipe(
      ofType(TRIGGER_SEARCH),
      map(R.prop('payload')),
      map((payload: EpicPayload) =>
        Actions.fetchSearchEntries({ queryString: payload.queryText })
      )
    )
  }

  [FETCH_SEARCH_ENTRIES](action$: any) {
    return action$.pipe(
      ofType(FETCH_SEARCH_ENTRIES),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const query = this.queryTool.buildQuery({ queryType: 'search' })
        const variables = {
          queryString: payload.queryString
            ? payload.queryString.replace(/[%_]/g, '\\$&')
            : undefined
        }

        return { queryString: payload.queryString, query, variables }
      }),
      mergeMap((context: any) =>
        this.queryTool
          .sendRequest({ query: context.query, variables: context.variables })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      map(
        ({ context, data, error }: { context: any; data: any; error: any }) => {
          if (error) {
            Logger.epicError('fetchSearchEntriesEpic', context, error)

            return Actions.addDangerAlert({
              message: 'Error loading search results.'
            })
          }

          return Actions.updateSearchEntries({
            queryString: context.queryString,
            data
          })
        }
      )
    )
  }
}
