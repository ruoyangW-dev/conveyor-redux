import { ofType } from 'redux-observable'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import * as consts from '../actionConsts'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'

export const generateSearchQuerySubmitEpic = () => action$ =>
  action$.pipe(
    ofType(consts.TRIGGER_SEARCH),
    map(R.prop('payload')),
    map(payload =>
      Actions.fetchSearchEntries({ queryString: payload.queryText })
    )
  )

export const generateFetchSearchEntriesEpic = (schema, doRequest) => action$ =>
  action$.pipe(
    ofType(consts.FETCH_SEARCH_ENTRIES),
    map(R.prop('payload')),
    map(payload => {
      const query = doRequest.buildQuery({ queryType: 'search' })
      const variables = {
        queryString: payload.queryString.replace(/[%_]/g, '\\$&')
      }

      return { queryString: payload.queryString, query, variables }
    }),
    mergeMap(context =>
      doRequest
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
