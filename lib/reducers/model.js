'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexUrl = exports.getDetailUrl = exports.selectModel = exports.generateModelReducer = exports.getOrderedValues = exports.getAllModelStore = exports.getModelStore = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _actionConsts = require('../actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initState = {};

var getModelStore = exports.getModelStore = function getModelStore(state, modelName) {
  return R.path(['model', modelName], state);
};

var getAllModelStore = exports.getAllModelStore = function getAllModelStore(state) {
  return R.path(['model'], state);
};

var getDefaultModelStore = function getDefaultModelStore() {
  return { order: [], values: {} };
};

var getOrderedValues = exports.getOrderedValues = function getOrderedValues(store) {
  var order = R.prop('order', store);
  var values = R.prop('values', store);
  if (R.isNil(order) || R.isNil(values)) {
    return [];
  }
  return order.map(function (id) {
    return values[id];
  });
};

var updateIndex = function updateIndex(state, modelName, data) {
  var oldStore = R.propOr(getDefaultModelStore(), modelName, state);
  var newStore = getDefaultModelStore();

  newStore.order = data.map(R.prop('id'));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;

      var oldNode = R.propOr({}, node.id, oldStore.values);
      var updatedNode = R.mergeDeepRight(oldNode, node);
      newStore.values[node.id] = updatedNode;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return _defineProperty({ ...state }, modelName, newStore);
};

var generateModelReducer = exports.generateModelReducer = function generateModelReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

    var modelName = R.path(['payload', 'modelName'], action);

    switch (action.type) {
      case Actions.UPDATE_MODEL_INDEX:
        {
          return updateIndex(state, modelName, R.pathOr([], ['payload', 'data', 'result'], action));
        }

      case Actions.UPDATE_MODEL_DETAIL:
        {
          var id = R.path(['payload', 'id'], action);
          var store = { ...R.propOr(getDefaultModelStore(), modelName, state) };
          var oldNode = R.prop(id, store.values);
          var newNode = R.pathOr(R.path(['payload', 'data'], action), ['payload', 'data', 'result'], action);

          if (!oldNode) {
            // node does not exist in store, add it
            store.order.push(id);
          }
          store.values[id] = newNode;

          return _defineProperty({ ...state }, modelName, store);
        }

      default:
        return state;
    }
  };
};

var selectModel = exports.selectModel = R.propOr(initState, 'model');
var getDetailUrl = exports.getDetailUrl = function getDetailUrl(_ref3) {
  var modelName = _ref3.modelName,
      id = _ref3.id;
  return '/' + modelName + '/' + id;
};
var getIndexUrl = exports.getIndexUrl = function getIndexUrl(_ref4) {
  var modelName = _ref4.modelName;
  return '/' + modelName;
};