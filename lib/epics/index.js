import _toConsumableArray from "@babel/runtime-corejs3/helpers/esm/toConsumableArray";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { generateFetchModelIndexEpic, generateFetchModelDetailEpic } from './model';
import { generateRelationshipSelectMenuOpenEpic, generateQuerySelectMenuOpenEpic } from './options';
import { generateRouteEpic } from './route';
import { generateFetchSearchEntriesEpic, generateSearchQuerySubmitEpic } from './search';
import { generateIndexTableFilterChangeEpic, generateIndexTableSortChangeEpic } from './indexTable';
import { generateFetchTooltipEpic } from './tooltip';
import * as Actions from '../actions';
import * as Logger from '../utils/Logger';
import * as R from 'ramda';
export var generateConveyorEpics = function generateConveyorEpics(schema, doRequest) {
  var fetchModelIndexEpic = generateFetchModelIndexEpic(schema, doRequest);
  var fetchModelDetailEpic = generateFetchModelDetailEpic(schema, doRequest);
  var fetchSearchEntriesEpic = generateFetchSearchEntriesEpic(schema, doRequest);
  var indexFilterEpic = generateIndexTableFilterChangeEpic(schema, doRequest);
  var indexSortEpic = generateIndexTableSortChangeEpic(schema, doRequest);
  var querySelectMenuOpenEpic = generateQuerySelectMenuOpenEpic(schema, doRequest);
  var relationshipSelectMenuOpenEpic = generateRelationshipSelectMenuOpenEpic(schema, doRequest);
  var routeEpic = generateRouteEpic(schema, doRequest);
  var searchQuerySubmitEpic = generateSearchQuerySubmitEpic(schema, doRequest);
  var tooltipEpic = generateFetchTooltipEpic(schema, doRequest);
  return {
    fetchModelIndexEpic: fetchModelIndexEpic,
    fetchModelDetailEpic: fetchModelDetailEpic,
    fetchSearchEntriesEpic: fetchSearchEntriesEpic,
    indexFilterEpic: indexFilterEpic,
    indexSortEpic: indexSortEpic,
    querySelectMenuOpenEpic: querySelectMenuOpenEpic,
    relationshipSelectMenuOpenEpic: relationshipSelectMenuOpenEpic,
    routeEpic: routeEpic,
    searchQuerySubmitEpic: searchQuerySubmitEpic,
    tooltipEpic: tooltipEpic
  };
};
/**
 * Combine epics together and catch any errors when creating the root epic.
 * If there are any errors it will log it and add the error to the store.
 * credit: https://github.com/redux-observable/redux-observable/issues/94#issuecomment-396763936
 * @param store - the store of the application
 * @param epics - an object containing all the epics to be combined
 * @return The combined epics
 */

export var combineEpicsAndCatchErrors = function combineEpicsAndCatchErrors(store) {
  for (var _len = arguments.length, epics = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    epics[_key - 1] = arguments[_key];
  }

  return function (action$, state$, dep) {
    epics = _mapInstanceProperty(epics).call(epics, function (epic) {
      return function (action$, state$) {
        return epic(action$, state$, dep).pipe(catchError(function (error, caught) {
          var epicName = R.prop('name', epic);
          Logger.rootEpicError(epicName, error);
          store.dispatch(Actions.addDangerAlert({
            message: 'An error has occurred while combining epics.'
          }));
          return caught;
        }));
      };
    });
    return combineEpics.apply(void 0, _toConsumableArray(epics))(action$, state$);
  };
};