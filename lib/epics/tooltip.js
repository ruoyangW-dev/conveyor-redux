import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import * as Actions from '../actions';
import * as consts from '../actionConsts';
import * as Logger from '../utils/Logger';
import * as R from 'ramda';
export var generateFetchTooltipEpic = function generateFetchTooltipEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.FETCH_MODEL_TOOLTIP), map(R.prop('payload')), map(function (payload) {
      var variables = {
        id: payload.id
      };
      var query = doRequest.buildQuery({
        modelName: payload.modelName,
        queryType: 'tooltip'
      });
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
        Logger.epicError('fetchModelTooltipEpic', context, error);
        return Actions.addDangerAlert({
          message: "Error loading ".concat(context.modelName, " tooltip")
        });
      }

      return Actions.updateModelTooltip({
        modelName: context.modelName,
        id: context.id,
        data: data
      });
    }));
  };
};