import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import { SEARCH_QUERY_TEXT_CHANGED, SEARCH_QUERY_LINK_CLICKED, UPDATE_SEARCH_ENTRIES, SEARCH_BLUR, TRIGGER_SEARCH } from '../actionConsts';
import * as R from 'ramda';
import { getDisplayValue, getModelLabel } from 'conveyor';
export var initState = {
  queryText: '',
  entries: [],
  dropdown: false
};
export var generateSearchReducer = function generateSearchReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case UPDATE_SEARCH_ENTRIES:
        {
          var data = R.pathOr({}, ['payload', 'data'], action);

          if (R.pathOr(0, ['search', 'length'], data) <= 0) {
            return _Object$assign({}, state, {
              entries: []
            });
          }

          var entries = R.pipe(R.propOr([], 'search'), R.map(function (entry) {
            return {
              id: entry.id,
              modelName: entry.__typename,
              modelLabel: getModelLabel({
                schema: schema,
                modelName: entry.__typename,
                node: entry
              }),
              name: getDisplayValue({
                schema: schema,
                modelName: entry.__typename,
                node: entry
              })
            };
          }), R.map(function (obj) {
            var _context;

            return _Object$assign({}, obj, {
              detailURL: _concatInstanceProperty(_context = "/".concat(obj.modelName, "/")).call(_context, obj.id)
            });
          }))(data);
          return _Object$assign({}, state, {
            entries: entries
          });
        }

      case SEARCH_QUERY_TEXT_CHANGED:
        {
          var newQueryText = action.payload.queryText;

          if (newQueryText) {
            return R.assoc('queryText', newQueryText, state);
          }

          return initState;
        }

      case SEARCH_QUERY_LINK_CLICKED:
        return initState;

      case SEARCH_BLUR:
        return R.assoc('dropdown', false, state);

      case TRIGGER_SEARCH:
        return R.assoc('dropdown', true, state);

      default:
        return state;
    }
  };
};
export var selectSearch = R.propOr(initState, 'search');
export var selectSearchDropdown = function selectSearchDropdown(state) {
  return R.prop('dropdown', selectSearch(state));
};
export var selectSearchEntries = function selectSearchEntries(state) {
  return R.prop('entries', selectSearch(state));
};
export var selectSearchQueryText = function selectSearchQueryText(state) {
  return R.prop('queryText', selectSearch(state));
};