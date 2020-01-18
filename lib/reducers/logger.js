'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectErrors = exports.generateLoggerReducer = exports.initState = undefined;

var _actionConsts = require('../actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initState = exports.initState = [];

var handleError = function handleError(_ref) {
  var payload = _ref.payload,
      type = _ref.type;

  if (!payload.expiresOn && !payload.noExpire) {
    payload.expiresOn = Date.now() + 5 * 1000;
  }
  return R.assoc('type', type, payload);
};

var generateLoggerReducer = exports.generateLoggerReducer = function generateLoggerReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

    switch (action.type) {
      case Actions.ERROR_LOGGER:
        return [].concat(_toConsumableArray(state), [handleError({ payload: action.payload, type: 'danger' })]);

      default:
        return state;
    }
  };
};

var selectErrors = exports.selectErrors = R.propOr(initState, 'errors');