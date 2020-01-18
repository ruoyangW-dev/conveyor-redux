'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateConveyorEpics = undefined;

var _reduxObservable = require('redux-observable');

var _indexTable = require('./indexTable');

var _model = require('./model');

var _route = require('./route');

var generateConveyorEpics = exports.generateConveyorEpics = function generateConveyorEpics(schema, doRequest) {
  var fetchModelIndexEpic = (0, _model.generateFetchModelIndexEpic)(schema, doRequest);
  var fetchModelDetailEpic = (0, _model.generateFetchModelDetailEpic)(schema, doRequest);
  var indexFilterEpic = (0, _indexTable.generateIndexTableFilterChangeEpic)(schema, doRequest);
  var indexSortEpic = (0, _indexTable.generateIndexTableSortChangeEpic)(schema, doRequest);
  var routeEpic = (0, _route.generateRouteEpic)(schema, doRequest);

  return (0, _reduxObservable.combineEpics)(fetchModelIndexEpic, fetchModelDetailEpic, indexFilterEpic, indexSortEpic, routeEpic);
};