import { ofType } from 'redux-observable';
import * as R from 'ramda';
import { map, mergeMap } from 'rxjs/operators';
import * as Actions from '../actions';
import * as consts from '../actionConsts';
import * as Logger from '../utils/Logger';
export var generateFetchDeleteDetailEpic = function generateFetchDeleteDetailEpic(doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.FETCH_DELETE_DETAIL), map(R.prop('payload')), map(function (payload) {
      var query = doRequest.buildQuery({
        modelName: payload.modelName,
        queryType: 'deleteCascades'
      });
      var variables = {
        modelName: payload.modelName,
        id: payload.id
      };
      return {
        modelName: payload.modelName,
        id: payload.id,
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
        Logger.epicError('fetchDeleteDetailEpic', context, error);
        return Actions.addDangerAlert({
          message: "Error loading ".concat(context.modelName, " delete detail.")
        });
      }

      return Actions.updateDeleteDetail({
        data: data
      });
    }));
  };
};