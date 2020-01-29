import * as Actions from '../actions';
import * as consts from '../actionConsts';
import * as R from 'ramda';
import { getFilters, getSort } from '../utils/Getters';
import { map, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { selectTableView } from '../reducers/tableView';
export var generateFetchModelIndexEpic = function generateFetchModelIndexEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.FETCH_MODEL_INDEX), map(R.prop('payload')), map(function (payload) {
      var variables = {
        filter: getFilters({
          schema: schema,
          modelName: payload.modelName,
          tableView: selectTableView(state$.value)
        }),
        sort: getSort({
          schema: schema,
          modelName: payload.modelName,
          tableView: selectTableView(state$.value)
        })
      };
      return {
        modelName: payload.modelName,
        variables: variables
      };
    }), mergeMap(function (context) {
      var query = doRequest.buildQuery(context.modelName, 'index');
      return doRequest.sendRequest(query, context.variables).then(function (_ref) {
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
        return Actions.addDangerAlert({
          message: "Error loading ".concat(context.modelName, " index.")
        });
      }

      return Actions.updateModelIndex({
        modelName: context.modelName,
        data: data
      });
    }));
  };
};
export var generateFetchModelDetailEpic = function generateFetchModelDetailEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.FETCH_MODEL_DETAIL), map(R.prop('payload')), map(function (payload) {
      var variables = {
        id: payload.id
      };
      return {
        modelName: payload.modelName,
        id: payload.id,
        variables: variables
      };
    }), mergeMap(function (context) {
      var query = doRequest.buildQuery(context.modelName, 'detail');
      return doRequest.sendRequest(query, context.variables).then(function (_ref3) {
        var data = _ref3.data,
            error = _ref3.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), map(function (_ref4) {
      var context = _ref4.context,
          data = _ref4.data,
          error = _ref4.error;

      if (error) {
        return Actions.addDangerAlert({
          message: "Error loading ".concat(context.modelName, " details.")
        });
      }

      return Actions.updateModelDetail({
        modelName: context.modelName,
        id: context.id,
        data: data
      });
    }));
  };
};