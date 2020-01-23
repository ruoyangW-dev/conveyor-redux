import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.string.split";
import { LOCATION_CHANGE } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { concat } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getHasIndex, getHasDetail } from 'conveyor';
import * as R from 'ramda';
import * as Actions from '../actions';

var isModelPathPrefix = function isModelPathPrefix(path, schema) {
  return path.length >= 2 && path[0] === '' && R.propOr(false, path[1]) && (getHasIndex(schema, path[1]) || getHasDetail(schema, path[1]));
};

var modelIndexPath = function modelIndexPath(_ref) {
  var path = _ref.path,
      schema = _ref.schema;

  if (path.length === 2 && isModelPathPrefix(path, schema)) {
    var modelName = path[1];

    if (getHasIndex(schema, modelName)) {
      return [Actions.fetchModelIndex({
        modelName: modelName
      })];
    }
  }
};

var modelDetailPath = function modelDetailPath(_ref2) {
  var path = _ref2.path,
      state = _ref2.state,
      schema = _ref2.schema;

  if (path.length >= 3 && isModelPathPrefix(path, schema) && path[2] !== 'create') {
    return [Actions.fetchModelDetail({
      modelName: path[1],
      id: path[2]
    })];
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

export var generateRouteEpic = function generateRouteEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe(ofType(LOCATION_CHANGE), map(getPath), switchMap(function (path) {
      var state = state$.value;
      var actions = R.pipe(R.ap(pathFunctions), R.reject(R.equals(undefined)), R.flatten)([{
        path: path,
        state: state
      }]);
      return concat(actions);
    }));
  };
};