import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.string.replace";
import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import * as Actions from '../actions';
import * as consts from '../actionConsts';
import * as Logger from '../utils/Logger';
import * as R from 'ramda';
export var generateSearchQuerySubmitEpic = function generateSearchQuerySubmitEpic() {
  return function (action$) {
    return action$.pipe(ofType(consts.TRIGGER_SEARCH), map(R.prop('payload')), map(function (payload) {
      return Actions.fetchSearchEntries({
        queryString: payload.queryText
      });
    }));
  };
};
export var generateFetchSearchEntriesEpic = function generateFetchSearchEntriesEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.FETCH_SEARCH_ENTRIES), map(R.prop('payload')), map(function (payload) {
      var query = doRequest.buildQuery({
        queryType: 'search'
      });
      var variables = {
        queryString: payload.queryString.replace(/[%_]/g, '\\$&')
      };
      return {
        queryString: payload.queryString,
        query: query,
        variables: variables
      };
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref) {
        var data = _ref.data,
            error = _ref.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), map(function (_ref2) {
      var context = _ref2.context,
          data = _ref2.data,
          error = _ref2.error;

      if (error) {
        Logger.epicError('fetchSearchEntriesEpic', context, error);
        return Actions.addDangerAlert({
          message: 'Error loading search results.'
        });
      }

      return Actions.updateSearchEntries({
        queryString: context.queryString,
        data: data
      });
    }));
  };
};