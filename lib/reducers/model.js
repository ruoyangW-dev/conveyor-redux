import "core-js/modules/es.array.join";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _valuesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/values";
import _getIterator from "@babel/runtime-corejs3/core-js/get-iterator";
import _defineProperty from "@babel/runtime-corejs3/helpers/esm/defineProperty";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import _slicedToArray from "@babel/runtime-corejs3/helpers/esm/slicedToArray";
import _Object$entries2 from "@babel/runtime-corejs3/core-js-stable/object/entries";
import _sliceInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/slice";
import * as R from 'ramda';
import * as Actions from '../actionConsts';
import { selectTableView } from './tableView';
import { getType } from 'conveyor';
var DEFAULT_PAGINATION_AMT = 20;
var initState = {};
export var getModelStore = function getModelStore(state, modelName) {
  return R.path(['model', modelName], state);
};

var slicePageData = function slicePageData(data, idx, amount) {
  var firstIdx = idx * amount; // obj of firstIdx included

  var lastIdx = (idx + 1) * amount; // obj of lastIdx NOT included => cutoff point
  // slice(first_index, cutoff_index)

  return _sliceInstanceProperty(data).call(data, firstIdx, lastIdx);
};

export var getPaginatedModel = function getPaginatedModel(state, modelName) {
  var idx = R.pathOr(0, [modelName, 'page', 'currentPage'], selectTableView(state));
  var amount = R.propOr(DEFAULT_PAGINATION_AMT, 'amtPerPage', selectTableView(state));
  return slicePageData(getOrderedValues(getModelStore(state, modelName)), idx, amount);
};
export var getPaginatedNode = function getPaginatedNode(schema, state, modelName, id) {
  var modelStore = getModelStore(state, modelName);
  var node = R.pathOr(null, ['values', id], modelStore);
  var amount = R.propOr(DEFAULT_PAGINATION_AMT, 'amtPerPage', selectTableView(state)); // do not change the redux store

  var updatedNode = {};

  if (node) {
    for (var _i = 0, _Object$entries = _Object$entries2(node); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          fieldName = _Object$entries$_i[0],
          obj = _Object$entries$_i[1];

      var type = getType({
        schema: schema,
        modelName: modelName,
        fieldName: fieldName
      }); // if multi-rel type

      if (type && _includesInstanceProperty(type).call(type, 'ToMany') && !R.isEmpty(obj)) {
        var idx = R.pathOr(0, [modelName, 'fields', fieldName, 'page', 'currentPage'], selectTableView(state));
        updatedNode[fieldName] = slicePageData(obj, idx, amount);
      } else {
        updatedNode[fieldName] = obj;
      }
    }
  }

  return updatedNode;
};
export var getAllModelStore = function getAllModelStore(state) {
  return R.path(['model'], state);
};
export var getTabIdentifier = function getTabIdentifier(_ref) {
  var modelName = _ref.modelName,
      tabList = _ref.tabList;
  return R.prepend(modelName, tabList).join('.');
};

var getDefaultModelStore = function getDefaultModelStore() {
  return {
    order: [],
    values: {}
  };
};

export var getOrderedValues = function getOrderedValues(store) {
  var order = R.prop('order', store);
  var values = R.prop('values', store);

  if (R.isNil(order) || R.isNil(values)) {
    return [];
  }

  return _mapInstanceProperty(order).call(order, function (id) {
    return values[id];
  });
};

var updateIndex = function updateIndex(state, modelName, data) {
  var oldStore = R.propOr(getDefaultModelStore(), modelName, state);
  var newStore = getDefaultModelStore();
  newStore.order = _mapInstanceProperty(data).call(data, R.prop('id'));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;
      var oldNode = R.propOr({}, node.id, _valuesInstanceProperty(oldStore));
      _valuesInstanceProperty(newStore)[node.id] = R.mergeDeepRight(oldNode, node);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return _Object$assign({}, state, _defineProperty({}, modelName, newStore));
};

export var generateModelReducer = function generateModelReducer() {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var modelName = R.path(['payload', 'modelName'], action);

    switch (action.type) {
      case Actions.UPDATE_MODEL_INDEX:
        {
          return updateIndex(state, modelName, R.pathOr([], ['payload', 'data', 'result'], action));
        }

      case Actions.UPDATE_MODEL_DETAIL:
        {
          var id = R.path(['payload', 'id'], action);

          var store = _Object$assign({}, R.propOr(getDefaultModelStore(), modelName, state));

          var oldNode = R.prop(id, _valuesInstanceProperty(store));
          var newNode = R.pathOr(R.path(['payload', 'data'], action), ['payload', 'data', 'result'], action);

          if (!oldNode) {
            store.order.push(id);
          }

          _valuesInstanceProperty(store)[id] = newNode;
          return _Object$assign({}, state, _defineProperty({}, modelName, store));
        }

      default:
        return state;
    }
  };
};
export var selectModel = R.propOr(initState, 'model');
export var getDetailUrl = function getDetailUrl(_ref2) {
  var _context;

  var modelName = _ref2.modelName,
      id = _ref2.id;
  return _concatInstanceProperty(_context = "/".concat(modelName, "/")).call(_context, id);
};
export var getIndexUrl = function getIndexUrl(_ref3) {
  var modelName = _ref3.modelName;
  return "/".concat(modelName);
};