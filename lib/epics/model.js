'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateFetchDetailEpic = exports.generateFetchModelIndexEpic = undefined;

var _actions = require('../actions');

var Actions = _interopRequireWildcard(_actions);

var _actionConsts = require('../actionConsts');

var consts = _interopRequireWildcard(_actionConsts);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _conveyor = require('conveyor');

var _tableView = require('../reducers/tableView');

var _reduxObservable = require('redux-observable');

var _operators = require('rxjs/operators');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var getFilters = function getFilters(_ref) {
  var schema = _ref.schema,
      modelName = _ref.modelName,
      tableView = _ref.tableView;

  var fields = (0, _conveyor.getFields)(schema, modelName);
  var getFieldFilter = function getFieldFilter(field) {
    var fieldName = R.prop('fieldName', field);
    var operator = R.path(['filter', modelName, fieldName, 'operator', 'value'], tableView);
    var value = R.path(['filter', modelName, fieldName, 'value'], tableView);
    if (operator && field.type === _conveyor.inputTypes.BOOLEAN_TYPE) {
      return { operator: operator, value: R.isNil(value) ? false : value };
    }
    if (operator && !R.isNil(value) && !R.isEmpty(value)) {
      if ((0, _conveyor.isRel)(field)) {
        if ((0, _conveyor.getInputType)({ schema: schema, modelName: modelName, fieldName: fieldName }) === _conveyor.inputTypes.RELATIONSHIP_SINGLE) {
          return { operator: operator, value: R.propOr(value, 'value', value) };
        }
        return { operator: operator, value: value.map(function (val) {
            return val.value;
          }) };
      }
      if (field.type === _conveyor.inputTypes.ENUM_TYPE) {
        return { operator: operator, value: value.value };
      }
      return { operator: operator, value: value };
    }
    return undefined;
  };
  var filters = R.map(getFieldFilter, fields);
  // filterFields: default filters, in addition filters set by user; always active
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
      return [fieldName + '_' + sortKey];
    }
  }
  // otherwise, get default sort from schema
  // sortFields: camel-case fields followed by '_asc' or '_desc'.
  return R.path([modelName, 'sortFields'], schema);
};

var generateFetchModelIndexEpic = exports.generateFetchModelIndexEpic = function generateFetchModelIndexEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe((0, _reduxObservable.ofType)(consts.FETCH_MODEL_INDEX), (0, _operators.map)(R.prop('payload')), (0, _operators.map)(function (payload) {
      var variables = {
        filter: getFilters({
          schema: schema,
          modelName: payload.modelName,
          tableView: (0, _tableView.selectTableView)(state$.value)
        }),
        sort: getSort({
          schema: schema,
          modelName: payload.modelName,
          tableView: (0, _tableView.selectTableView)(state$.value)
        })
      };
      return { modelName: payload.modelName, variables: variables };
    }), (0, _operators.mergeMap)(function (context) {
      return doRequest(context.modelName, context.variables, 'index').then(function (_ref3) {
        var data = _ref3.data,
            error = _ref3.error;
        return { context: context, data: data, error: error };
      });
    }), (0, _operators.map)(function (_ref4) {
      var context = _ref4.context,
          data = _ref4.data,
          error = _ref4.error;

      if (error) {
        return Actions.errorLogger({ message: 'Error loading ' + context.modelName + ' index.' });
      }
      return Actions.updateModelIndex({ modelName: context.modelName, data: data });
    }));
  };
};

var generateFetchDetailEpic = exports.generateFetchDetailEpic = function generateFetchDetailEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe((0, _reduxObservable.ofType)(consts.FETCH_MODEL_DETAIL), (0, _operators.map)(R.prop('payload')), (0, _operators.map)(function (payload) {
      var variables = { id: payload.id };
      return { modelName: payload.modelName, id: payload.id, variables: variables };
    }), (0, _operators.mergeMap)(function (context) {
      return doRequest(context.modelName, context.variables, 'detail').then(function (_ref5) {
        var data = _ref5.data,
            error = _ref5.error;
        return { context: context, data: data, error: error };
      });
    }), (0, _operators.map)(function (_ref6) {
      var context = _ref6.context,
          data = _ref6.data,
          error = _ref6.error;

      if (error) {
        return Actions.errorLogger({ message: 'Error loading ' + context.modelName + ' details.' });
      }
      return Actions.updateModelIndex({ modelName: context.modelName, id: context.id, data: data });
    }));
  };
};