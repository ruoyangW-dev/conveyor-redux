import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import * as Actions from '../actions';
import * as consts from '../actionConsts';
import * as R from 'ramda';
import { getFields, inputTypes, getInputType, isRel } from 'conveyor';
import { selectTableView } from '../reducers/tableView';
import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';

var getFilters = function getFilters(_ref) {
  var schema = _ref.schema,
      modelName = _ref.modelName,
      tableView = _ref.tableView;
  var fields = getFields(schema, modelName);

  var getFieldFilter = function getFieldFilter(field) {
    var fieldName = R.prop('fieldName', field);
    var operator = R.path(['filter', modelName, fieldName, 'operator', 'value'], tableView);
    var value = R.path(['filter', modelName, fieldName, 'value'], tableView);

    if (operator && field.type === inputTypes.BOOLEAN_TYPE) {
      return {
        operator: operator,
        value: R.isNil(value) ? false : value
      };
    }

    if (operator && !R.isNil(value) && !R.isEmpty(value)) {
      if (isRel(field)) {
        if (getInputType({
          schema: schema,
          modelName: modelName,
          fieldName: fieldName
        }) === inputTypes.RELATIONSHIP_SINGLE) {
          return {
            operator: operator,
            value: R.propOr(value, 'value', value)
          };
        }

        return {
          operator: operator,
          value: _mapInstanceProperty(value).call(value, function (val) {
            return val.value;
          })
        };
      }

      if (field.type === inputTypes.ENUM_TYPE) {
        return {
          operator: operator,
          value: value.value
        };
      }

      return {
        operator: operator,
        value: value
      };
    }

    return undefined;
  };

  var filters = R.map(getFieldFilter, fields); // filterFields: default filters, in addition filters set by user; always active

  var defaultFilters = R.path([modelName, 'filterFields'], schema);

  if (defaultFilters) {
    filters = R.merge(filters, defaultFilters);
  }

  return R.filter(R.identity, filters);
};

var getSort = function getSort(_ref2) {
  var schema = _ref2.schema,
      modelName = _ref2.modelName,
      tableView = _ref2.tableView;

  // get sort from user input
  if (tableView) {
    var sortKey = R.path(['sort', modelName, 'sortKey'], tableView);
    var fieldName = R.path(['sort', modelName, 'fieldName'], tableView);

    if (sortKey && fieldName) {
      var _context;

      return [_concatInstanceProperty(_context = "".concat(fieldName, "_")).call(_context, sortKey)];
    }
  } // otherwise, get default sort from schema
  // sortFields: camel-case fields followed by '_asc' or '_desc'.


  return R.path([modelName, 'sortFields'], schema);
};

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
        return Actions.errorLogger({
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
      return doRequest.sendRequest(query, context.variables).then(function (_ref5) {
        var data = _ref5.data,
            error = _ref5.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), map(function (_ref6) {
      var context = _ref6.context,
          data = _ref6.data,
          error = _ref6.error;

      if (error) {
        return Actions.errorLogger({
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