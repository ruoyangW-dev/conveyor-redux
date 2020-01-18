'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateIndexTableSortChangeEpic = exports.generateIndexTableFilterChangeEpic = undefined;

var _reduxObservable = require('redux-observable');

var _operators = require('rxjs/operators');

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _actions = require('../actions');

var Actions = _interopRequireWildcard(_actions);

var _actionConsts = require('../actionConsts');

var consts = _interopRequireWildcard(_actionConsts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var generateIndexTableFilterChangeEpic = exports.generateIndexTableFilterChangeEpic = function generateIndexTableFilterChangeEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe((0, _reduxObservable.ofType)(consts.INDEX_TABLE_FILTER_SUBMIT), (0, _operators.map)(R.path(['payload', 'modelName'])), (0, _operators.map)(function (modelName) {
      return Actions.fetchModelIndex({ modelName: modelName });
    }));
  };
};

var generateIndexTableSortChangeEpic = exports.generateIndexTableSortChangeEpic = function generateIndexTableSortChangeEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe((0, _reduxObservable.ofType)(consts.INDEX_TABLE_SORT_CHANGE), (0, _operators.map)(R.path(['payload', 'modelName'])), (0, _operators.map)(function (modelName) {
      return Actions.fetchModelIndex({ modelName: modelName });
    }));
  };
};