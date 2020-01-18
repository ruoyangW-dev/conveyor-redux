'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRouteEpic = undefined;

var _connectedReactRouter = require('connected-react-router');

var _reduxObservable = require('redux-observable');

var _rxjs = require('rxjs');

var _operators = require('rxjs/operators');

var _conveyor = require('conveyor');

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _actions = require('../actions');

var Actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var isModelPathPrefix = function isModelPathPrefix(path, schema) {
  return path.length >= 2 && path[0] === '' && R.propOr(false, path[1]) && ((0, _conveyor.getHasIndex)(schema, path[1]) || (0, _conveyor.getHasDetail)(schema, path[1]));
};

var modelIndexPath = function modelIndexPath(_ref) {
  var path = _ref.path,
      schema = _ref.schema;

  if (path.length === 2 && isModelPathPrefix(path, schema)) {
    var modelName = path[1];

    if ((0, _conveyor.getHasIndex)(schema, modelName)) {
      return [Actions.fetchModelIndex({ modelName: modelName })];
    }
  }
};

var modelDetailPath = function modelDetailPath(_ref2) {
  var path = _ref2.path,
      state = _ref2.state,
      schema = _ref2.schema;

  if (path.length >= 3 && isModelPathPrefix(path, schema) && path[2] !== 'create') {
    return [Actions.fetchModelDetail({ modelName: path[1], id: path[2] })];
  }
};

var modelCreatePath = function modelCreatePath(_ref3) {
  var path = _ref3.path,
      schema = _ref3.schema;

  if (path.length === 3 && isModelPathPrefix(path) && path[2] === 'create') {
    return [];
  }
};

var pathFunctions = [modelIndexPath, modelDetailPath, modelCreatePath];

var getPath = function getPath(locationChangeAction) {
  return R.pipe(R.pathOr('', ['payload', 'location', 'pathname']), function (pathname) {
    return pathname.split('/');
  }, R.dropLastWhile(R.equals('')))(locationChangeAction);
};

var generateRouteEpic = exports.generateRouteEpic = function generateRouteEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe((0, _reduxObservable.ofType)(_connectedReactRouter.LOCATION_CHANGE), (0, _operators.map)(getPath), (0, _operators.switchMap)(function (path) {
      var state = state$.value;
      var actions = R.pipe(R.ap(pathFunctions), R.reject(R.equals(undefined)), R.flatten)([{ path: path, state: state }]);
      return (0, _rxjs.concat)(actions);
    }));
  };
};