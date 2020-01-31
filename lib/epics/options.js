import { getSort } from '../utils/Getters';
import { concat } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import * as Actions from '../actions';
import * as consts from '../actionConsts';
import * as Logger from '../utils/Logger';
import * as R from 'ramda';
export var generateQuerySelectMenuOpenEpic = function generateQuerySelectMenuOpenEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.QUERY_SELECT_MENU_OPEN), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var fieldName = R.prop('fieldName', payload);
      var variables = {
        modelName: payload.modelName,
        fieldName: payload.fieldName
      };
      return {
        variables: variables,
        modelName: modelName,
        fieldName: fieldName
      };
    }), mergeMap(function (context) {
      var query = doRequest.buildQuery({
        modelName: context.modelName,
        queryType: 'index'
      });
      return doRequest.sendRequest({
        query: query,
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
        Logger.epicError('querySelectMenuOpenEpic', context, error);
        return Actions.addDangerAlert({
          message: 'Error loading form option.'
        });
      }

      return Actions.existingValueUpdate({
        modelName: context.modelName,
        fieldName: context.fieldName,
        value: R.prop('result', data)
      });
    }));
  };
};
export var generateRelationshipSelectMenuOpenEpic = function generateRelationshipSelectMenuOpenEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.RELATIONSHIP_SELECT_MENU_OPEN), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var fieldName = R.prop('fieldName', payload);
      var field = R.path([modelName, 'fields', fieldName], schema);
      var targetModel = R.path(['type', 'target'], field);
      var variables = {
        sort: getSort({
          schema: schema,
          modelName: targetModel
        })
      };
      return {
        variables: variables,
        modelName: modelName,
        fieldName: fieldName,
        targetModel: targetModel
      };
    }), mergeMap(function (context) {
      var query = doRequest.buildQuery({
        modelName: context.targetModel,
        queryType: 'select'
      });
      return doRequest.sendRequest({
        query: query,
        variables: context.variables
      }).then(function (_ref3) {
        var data = _ref3.data,
            error = _ref3.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), switchMap(function (_ref4) {
      var context = _ref4.context,
          data = _ref4.data,
          error = _ref4.error;

      if (error) {
        Logger.epicError('relationshipSelectMenuOpenEpic', context, error);
        return Actions.addDangerAlert({
          message: 'Error loading form option.'
        });
      }

      return concat([Actions.dataOptionsUpdate({
        modelName: context.modelName,
        fieldName: context.fieldName,
        value: R.prop('result', data)
      }), Actions.updateModelIndex({
        modelName: context.targetModel,
        data: data
      })]);
    }));
  };
};