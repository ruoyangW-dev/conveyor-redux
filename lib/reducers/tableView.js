import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import _slicedToArray from "@babel/runtime-corejs3/helpers/esm/slicedToArray";
import _Object$entries from "@babel/runtime-corejs3/core-js-stable/object/entries";
import _spliceInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/splice";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _sliceInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/slice";
import * as Actions from '../actionConsts';
import * as R from 'ramda';
import { PAGINATION_AMT } from './model';
import { getType } from 'conveyor';
var initState = {};
export var generateTableViewReducer = function generateTableViewReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var payload = action.payload;

    var removeAll = function removeAll(modelName) {
      return R.dissocPath([modelName, 'filter', 'filterOrder'], R.dissocPath([modelName, 'filter', 'filterValue'], state));
    };

    var setValues = function setValues(type) {
      var modelName = R.prop('modelName', payload);
      var values = R.prop('values', payload);
      return R.assocPath([modelName, type], values, state);
    };

    switch (action.type) {
      case Actions.INDEX_ADD_FILTER:
        {
          var modelName = R.prop('modelName', payload);
          var filterOrder = R.pathOr([], [modelName, 'filter', 'filterOrder'], state);

          var newFilterOrder = _sliceInstanceProperty(filterOrder).call(filterOrder);

          newFilterOrder.push('');
          return R.assocPath([modelName, 'filter', 'filterOrder'], newFilterOrder, state);
        }

      case Actions.INDEX_DELETE_FILTER:
        {
          var _payload = _Object$assign({}, payload),
              _modelName = _payload.modelName,
              index = _payload.index;

          var _filterOrder = R.pathOr([], [_modelName, 'filter', 'filterOrder'], state);

          var fieldName = _filterOrder[index];

          var _newFilterOrder = _sliceInstanceProperty(_filterOrder).call(_filterOrder);

          _spliceInstanceProperty(_newFilterOrder).call(_newFilterOrder, index, 1);

          if (R.isNil(_newFilterOrder) || R.isEmpty(_newFilterOrder)) {
            return removeAll(_modelName);
          }

          return R.assocPath([_modelName, 'filter', 'filterOrder'], _newFilterOrder, R.dissocPath([_modelName, 'filter', 'filterValue', fieldName], state));
        }

      case Actions.INDEX_CLEAR_FILTERS:
        {
          var _modelName2 = R.prop('modelName', payload);

          return removeAll(_modelName2);
        }

      case Actions.INDEX_CHANGE_FILTER_FIELD:
        {
          var _payload2 = _Object$assign({}, payload),
              _modelName3 = _payload2.modelName,
              _fieldName = _payload2.fieldName,
              _index = _payload2.index;

          var _filterOrder2 = R.pathOr([], [_modelName3, 'filter', 'filterOrder'], state);

          var _newFilterOrder2 = _sliceInstanceProperty(_filterOrder2).call(_filterOrder2);

          _newFilterOrder2[_index] = _fieldName;
          return R.assocPath([_modelName3, 'filter', 'filterOrder'], _newFilterOrder2, state);
        }

      case Actions.INDEX_TABLE_FILTER_CHANGE:
        {
          var _payload3 = _Object$assign({}, payload),
              _modelName4 = _payload3.modelName,
              _fieldName2 = _payload3.fieldName,
              value = _payload3.value;

          return R.assocPath([_modelName4, 'filter', 'filterValue', _fieldName2, 'value'], value, state);
        }

      case Actions.INDEX_TABLE_FILTER_DROPDOWN:
        {
          var _payload4 = _Object$assign({}, payload),
              _modelName5 = _payload4.modelName,
              _fieldName3 = _payload4.fieldName,
              operator = _payload4.operator;

          return R.assocPath([_modelName5, 'filter', 'filterValue', _fieldName3, 'operator'], operator, state);
        }

      case Actions.INDEX_TABLE_FILTER_SUBMIT:
        {
          var _modelName6 = R.prop('modelName', payload);

          var currentFilters = R.pathOr([], [_modelName6, 'filter', 'filterOrder'], state);
          var filtersAreActive = !(R.isNil(currentFilters) || _Object$entries(currentFilters).length === 0);
          return R.assocPath([_modelName6, 'filter', 'filtersAreActive'], filtersAreActive, state);
        }

      case Actions.INDEX_TABLE_SORT_CHANGE:
        {
          var _payload5 = _Object$assign({}, payload),
              _modelName7 = _payload5.modelName,
              _fieldName4 = _payload5.fieldName,
              sortKey = _payload5.sortKey;

          return R.assocPath([_modelName7, 'sort'], {
            fieldName: _fieldName4,
            sortKey: sortKey
          }, state);
        }

      case Actions.COLLAPSE_TABLE_CHANGE:
        {
          var _payload6 = _Object$assign({}, payload),
              _modelName8 = _payload6.modelName,
              _fieldName5 = _payload6.fieldName,
              collapse = _payload6.collapse;

          return R.assocPath([_modelName8, 'fields', _fieldName5, 'collapse'], !collapse, state);
        }

      case Actions.CHANGE_PAGE:
        {
          var _payload7 = _Object$assign({}, payload),
              _modelName9 = _payload7.modelName,
              updatedPageIndex = _payload7.updatedPageIndex;

          return R.assocPath([_modelName9, 'page', 'currentPage'], updatedPageIndex, state);
        }

      case Actions.CHANGE_REL_TABLE_PAGE:
        {
          var _payload8 = _Object$assign({}, payload),
              _modelName10 = _payload8.modelName,
              _fieldName6 = _payload8.fieldName,
              _updatedPageIndex = _payload8.updatedPageIndex;

          return R.assocPath([_modelName10, 'fields', _fieldName6, 'page', 'currentPage'], _updatedPageIndex, state);
        }

      case Actions.UPDATE_MODEL_INDEX:
        {
          var data = R.pathOr([], ['data', 'result'], payload);

          var _modelName11 = R.prop('modelName', payload);

          var lastIndex = null;

          if (!R.isEmpty(data)) {
            var totalDataLength = data.length;
            lastIndex = Math.floor((totalDataLength - 1) / PAGINATION_AMT);
          }

          return R.assocPath([_modelName11, 'page', 'lastIndex'], lastIndex, state);
        }

      case Actions.UPDATE_MODEL_DETAIL:
        {
          var _modelName12 = R.prop('modelName', payload);

          var newNode = R.pathOr(R.prop('data', payload), ['data', 'result'], payload);

          if (newNode) {
            for (var _i = 0, _Object$entries2 = _Object$entries(newNode); _i < _Object$entries2.length; _i++) {
              var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i], 2),
                  _fieldName7 = _Object$entries2$_i[0],
                  obj = _Object$entries2$_i[1];

              var type = getType({
                schema: schema,
                modelName: _modelName12,
                fieldName: _fieldName7
              }); // if multi-rel type

              if (type && _includesInstanceProperty(type).call(type, 'ToMany') && !R.isEmpty(obj)) {
                var _totalDataLength = obj.length;
                var lastIndexRel = Math.floor((_totalDataLength - 1) / PAGINATION_AMT);

                if (lastIndexRel > 0) {
                  state = R.assocPath([_modelName12, 'fields', _fieldName7, 'page', 'lastIndex'], lastIndexRel, state);
                }
              }
            }
          }

          return state;
        }

      case Actions.UPDATE_OVERVIEW_DISPLAYED:
        {
          return setValues('selected');
        }

      case Actions.UPDATE_OVERVIEW_SELECTED:
        {
          return setValues('displayed');
        }

      default:
        return state;
    }
  };
};
export var selectTableView = function selectTableView(state) {
  return R.prop('tableView', state);
};