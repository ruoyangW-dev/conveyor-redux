'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectTableView = exports.generateTableViewReducer = undefined;

var _actionConsts = require('../actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initState = {};

var generateTableViewReducer = exports.generateTableViewReducer = function generateTableViewReducer() {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

    var payload = action.payload;
    var removeAll = function removeAll(modelName) {
      return R.dissocPath(['filterOrder', modelName], R.dissocPath(['filter', modelName], state));
    };

    switch (action.type) {
      case Actions.INDEX_ADD_FILTER:
        {
          var modelName = R.prop('modelName', payload);
          var filterOrder = R.pathOr([], ['filterOrder', modelName], state);
          var newFilterOrder = filterOrder.slice();
          newFilterOrder.push('');
          return R.assocPath(['filterOrder', modelName], newFilterOrder, state);
        }
      case Actions.INDEX_CLEAR_FILTERS:
        {
          var _modelName = R.prop('modelName', payload);
          return removeAll(_modelName);
        }
      case Actions.INDEX_CHANGE_FILTER_FIELD:
        {
          var _payload = { ...payload },
              _modelName2 = _payload.modelName,
              fieldName = _payload.fieldName,
              index = _payload.index;

          var _filterOrder = R.pathOr([], ['filterOrder', _modelName2], state);
          var _newFilterOrder = _filterOrder.slice();
          _newFilterOrder[index] = fieldName;
          return R.assocPath(['filterOrder', _modelName2], _newFilterOrder, state);
        }
      case Actions.INDEX_DELETE_FILTER:
        {
          var _payload2 = { ...payload },
              _modelName3 = _payload2.modelName,
              _index = _payload2.index;

          var _filterOrder2 = R.pathOr([], ['filterOrder', _modelName3], state);
          var _fieldName = _filterOrder2[_index];
          var _newFilterOrder2 = _filterOrder2.slice();
          _newFilterOrder2.splice(_index, 1);
          if (R.isNil(_newFilterOrder2) || R.isEmpty(_newFilterOrder2)) {
            return removeAll(_modelName3);
          }
          return R.assocPath(['filterOrder', _modelName3], _newFilterOrder2, R.dissocPath(['filter', _modelName3, _fieldName], state));
        }
      case Actions.INDEX_TABLE_FILTER_CHANGE:
        {
          var _payload3 = { ...payload },
              _modelName4 = _payload3.modelName,
              _fieldName2 = _payload3.fieldName,
              value = _payload3.value;

          return R.assocPath(['filter', _modelName4, _fieldName2, 'value'], value, state);
        }
      case Actions.INDEX_TABLE_FILTER_SUBMIT:
        {
          var _modelName5 = R.prop('modelName', payload);
          var currentFilters = R.pathOr([], ['filterOrder', _modelName5], state);
          var filtersAreActive = !(R.isNil(currentFilters) || Object.entries(currentFilters).length === 0);
          return R.assocPath(['filtersAreActive', _modelName5], filtersAreActive, state);
        }
      case Actions.INDEX_TABLE_FILTER_DROPDOWN:
        {
          var _payload4 = { ...payload },
              _modelName6 = _payload4.modelName,
              _fieldName3 = _payload4.fieldName,
              operator = _payload4.operator;

          return R.assocPath(['filter', _modelName6, _fieldName3, 'operator'], operator, state);
        }
      case Actions.INDEX_TABLE_SORT_CHANGE:
        {
          var _payload5 = { ...payload },
              _modelName7 = _payload5.modelName,
              _fieldName4 = _payload5.fieldName,
              sortKey = _payload5.sortKey;

          return R.assocPath(['sort', _modelName7], { fieldName: _fieldName4, sortKey: sortKey }, state);
        }
      case Actions.HIDE_TABLE_CHANGE:
        {
          var _payload6 = { ...payload },
              _modelName8 = _payload6.modelName,
              _fieldName5 = _payload6.fieldName,
              id = _payload6.id,
              hideTable = _payload6.hideTable;

          return R.assocPath(['hideTable', _modelName8, id.toString(), _fieldName5], !hideTable, state);
        }

      default:
        return state;
    }
  };
};

var selectTableView = exports.selectTableView = function selectTableView(state) {
  return R.prop('tableView', state);
};