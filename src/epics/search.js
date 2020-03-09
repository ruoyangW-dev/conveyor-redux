import { ofType } from 'redux-observable'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import { TRIGGER_SEARCH, FETCH_SEARCH_ENTRIES } from '../actionConsts'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'
import { Epic } from './epic'

export class SearchEpic extends Epic {
  [TRIGGER_SEARCH](action$) {
    return action$.pipe(
      ofType(TRIGGER_SEARCH),
      map(R.prop('payload')),
      map(payload =>
        Actions.fetchSearchEntries({ queryString: payload.queryText })
      )
    )
  }

  [FETCH_SEARCH_ENTRIES](action$) {
    return action$.pipe(
      ofType(FETCH_SEARCH_ENTRIES),
      map(R.prop('payload')),
      map(payload => {
        const query = this.doRequest.buildQuery({ queryType: 'search' })
        const variables = {
          queryString: payload.queryString.replace(/[%_]/g, '\\$&')
        }

        return { queryString: payload.queryString, query, variables }
      }),
      mergeMap(context =>
        this.doRequest
          .sendRequest({ query: context.query, variables: context.variables })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      map(({ context, data, error }) => {
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
      })
    )
  }
}
