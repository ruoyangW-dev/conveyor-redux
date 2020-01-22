import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _valuesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/values";
import _getIterator from "@babel/runtime-corejs3/core-js/get-iterator";
import _defineProperty from "@babel/runtime-corejs3/helpers/esm/defineProperty";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _sliceInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/slice";
import * as R from 'ramda';
import * as Actions from '../actionConsts';
import { selectTableView } from './tableView';
export var PAGINATION_AMT = 20;
var initState = {};

var getModelStore = exports.getModelStore = function getModelStore(state, modelName) {
  return R.path(['model', modelName], state);
};

var getAllModelStore = exports.getAllModelStore = function getAllModelStore(state) {
=======
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _valuesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/values";
import _getIterator from "@babel/runtime-corejs3/core-js/get-iterator";
import _defineProperty from "@babel/runtime-corejs3/helpers/esm/defineProperty";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _sliceInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/slice";
import * as R from 'ramda';
import * as Actions from '../actionConsts';
import { selectTableView } from './tableView';
export var PAGINATION_AMT = 20;
var initState = {};
export var getModelStore = function getModelStore(state, modelName) {
  return R.path(['model', modelName], state);
};
export var getModelStoreOrder = function getModelStoreOrder(state, modelName) {
  return R.path(['model', modelName, 'order'], state);
};
export var getPaginatedModel = function getPaginatedModel(state, modelName) {
  var _context;

  var amount = PAGINATION_AMT;
  var idx = R.pathOr(0, ['page', modelName], selectTableView(state));
  var firstIdx = idx * amount;
  var lastIdx = (idx + 1) * amount;
  return _sliceInstanceProperty(_context = getOrderedValues(getModelStore(state, modelName))).call(_context, firstIdx, lastIdx);
};
export var getAllModelStore = function getAllModelStore(state) {
>>>>>>> master
  return R.path(['model'], state);
};

var getDefaultModelStore = function getDefaultModelStore() {
<<<<<<< HEAD
  return { order: [], values: {} };
};

var getOrderedValues = exports.getOrderedValues = function getOrderedValues(store) {
  var order = R.prop('order', store);
  var values = R.prop('values', store);
  if (R.isNil(order) || R.isNil(values)) {
    return [];
  }
  return order.map(function (id) {
=======
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
>>>>>>> master
    return values[id];
  });
};

var updateIndex = function updateIndex(state, modelName, data) {
  var oldStore = R.propOr(getDefaultModelStore(), modelName, state);
  var newStore = getDefaultModelStore();
<<<<<<< HEAD

  newStore.order = data.map(R.prop('id'));
=======
  newStore.order = _mapInstanceProperty(data).call(data, R.prop('id'));
>>>>>>> master
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
<<<<<<< HEAD
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;

      var oldNode = R.propOr({}, node.id, oldStore.values);
      var updatedNode = R.mergeDeepRight(oldNode, node);
      newStore.values[node.id] = updatedNode;
=======
    for (var _iterator = _getIterator(data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;
      var oldNode = R.propOr({}, node.id, _valuesInstanceProperty(oldStore));
      _valuesInstanceProperty(newStore)[node.id] = R.mergeDeepRight(oldNode, node);
>>>>>>> master
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
<<<<<<< HEAD
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
=======
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
>>>>>>> master
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

<<<<<<< HEAD
  return _defineProperty({ ...state }, modelName, newStore);
};

var generateModelReducer = exports.generateModelReducer = function generateModelReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

=======
  return _Object$assign({}, state, _defineProperty({}, modelName, newStore));
};

export var generateModelReducer = function generateModelReducer() {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
>>>>>>> master
    var modelName = R.path(['payload', 'modelName'], action);

    switch (action.type) {
      case Actions.UPDATE_MODEL_INDEX:
        {
          return updateIndex(state, modelName, R.pathOr([], ['payload', 'data', 'result'], action));
        }

      case Actions.UPDATE_MODEL_DETAIL:
        {
          var id = R.path(['payload', 'id'], action);
<<<<<<< HEAD
          var store = { ...R.propOr(getDefaultModelStore(), modelName, state) };
          var oldNode = R.prop(id, store.values);
          var newNode = R.pathOr(R.path(['payload', 'data'], action), ['payload', 'data', 'result'], action);

          if (!oldNode) {
            // node does not exist in store, add it
            store.order.push(id);
          }
          store.values[id] = newNode;

          return _defineProperty({ ...state }, modelName, store);
=======

          var store = _Object$assign({}, R.propOr(getDefaultModelStore(), modelName, state));

          var oldNode = R.prop(id, _valuesInstanceProperty(store));
          var newNode = R.pathOr(R.path(['payload', 'data'], action), ['payload', 'data', 'result'], action);

          if (!oldNode) {
            store.order.push(id);
          }

          _valuesInstanceProperty(store)[id] = newNode;
          return _Object$assign({}, state, _defineProperty({}, modelName, store));
>>>>>>> master
        }

      default:
        return state;
    }
  };
};
<<<<<<< HEAD

var selectModel = exports.selectModel = R.propOr(initState, 'model');
var getDetailUrl = exports.getDetailUrl = function getDetailUrl(_ref3) {
  var modelName = _ref3.modelName,
      id = _ref3.id;
  return '/' + modelName + '/' + id;
};
var getIndexUrl = exports.getIndexUrl = function getIndexUrl(_ref4) {
  var modelName = _ref4.modelName;
  return '/' + modelName;
=======
export var selectModel = R.propOr(initState, 'model');
export var getDetailUrl = function getDetailUrl(_ref) {
  var _context2;

  var modelName = _ref.modelName,
      id = _ref.id;
  return _concatInstanceProperty(_context2 = "/".concat(modelName, "/")).call(_context2, id);
};
export var getIndexUrl = function getIndexUrl(_ref2) {
  var modelName = _ref2.modelName;
  return "/".concat(modelName);
>>>>>>> master
};
