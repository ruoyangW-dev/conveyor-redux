import { combineEpics } from 'redux-observable';
import { generateIndexTableFilterChangeEpic, generateIndexTableSortChangeEpic } from './indexTable';
import { generateFetchModelIndexEpic, generateFetchModelDetailEpic } from './model';
import { generateRouteEpic } from './route';
import { generateTooltipEpic } from './tooltip';
export var generateConveyorEpics = function generateConveyorEpics(schema, doRequest) {
  var fetchModelIndexEpic = generateFetchModelIndexEpic(schema, doRequest);
  var fetchModelDetailEpic = generateFetchModelDetailEpic(schema, doRequest);
  var indexFilterEpic = generateIndexTableFilterChangeEpic(schema, doRequest);
  var indexSortEpic = generateIndexTableSortChangeEpic(schema, doRequest);
  var routeEpic = generateRouteEpic(schema, doRequest);
  var tooltipEpic = generateTooltipEpic(schema, doRequest);
  return {
    fetchModelIndexEpic: fetchModelIndexEpic,
    fetchModelDetailEpic: fetchModelDetailEpic,
    indexFilterEpic: indexFilterEpic,
    indexSortEpic: indexSortEpic,
    routeEpic: routeEpic,
    tooltipEpic: tooltipEpic
  };
};