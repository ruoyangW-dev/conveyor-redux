import { ofType } from 'redux-observable'
import { map, mergeMap } from 'rxjs/operators'
import * as Actions from '../actions'
import { TRIGGER_SEARCH, FETCH_SEARCH_ENTRIES } from '../actionConsts'
import * as Logger from '../utils/Logger'
import * as R from 'ramda'
import { Epic } from './epic'
import { EpicPayload } from '../types'

/**
 * A class containing epics handling search actions
 */
export class SearchEpic extends Epic {
  /**
   * Called after doing an action in the search bar after [onSearchBlur](./searchreducer.html#search_blur) was dispatched
   * @param action$ object {type: string}
   * @returns - Actions.[fetchSearchEntries](./searchepic.html#fetch_search_entries)({
   * queryString: string, isOnSearchPage: boolean})
   */
  [TRIGGER_SEARCH](action$: any) {
    return action$.pipe(
      ofType(TRIGGER_SEARCH),
      map(R.prop('payload')),
      map((payload: EpicPayload) =>
        Actions.fetchSearchEntries({
          queryString: payload.queryText,
          isOnSearchPage: payload.isOnSearchPage
        })
      )
    )
  }

  /**
   * Dispatched by [onTriggerSearch](./searchepic.html#trigger_search)
   * @param action$ object {type: string, payload: {queryString: string, isOnSearchpage: boolean}}
   * @returns - Actions.[updateSearchEntries](./searchreducer.html#update_search_entries) (if isOnSearchPage is false),
   * or Actions.[updateSearchPageEntries](./searchreducer.html#update_search_page_entries) (if isOnSearchPage is true)
   */
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

        return {
          queryString: payload.queryString,
          isOnSearchPage: payload.isOnSearchPage,
          query,
          variables
        }
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
          if (context.isOnSearchPage) {
            return Actions.updateSearchPageEntries({
              queryString: context.queryString,
              data
            })
          } else {
            return Actions.updateSearchEntries({
              queryString: context.queryString,
              data
            })
          }
        }
      )
    )
  }
}
