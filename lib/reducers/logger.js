import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _toConsumableArray from "@babel/runtime-corejs3/helpers/esm/toConsumableArray";
import _Date$now from "@babel/runtime-corejs3/core-js-stable/date/now";
import * as Actions from '../actionConsts';
import * as R from 'ramda';
export var initState = [];

var handleError = function handleError(_ref) {
  var payload = _ref.payload,
      type = _ref.type;

  if (!payload.expiresOn && !payload.noExpire) {
    payload.expiresOn = _Date$now() + 5 * 1000;
  }

  return R.assoc('type', type, payload);
};

export var generateLoggerReducer = function generateLoggerReducer(schema) {
  return function () {
    var _context;

    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case Actions.ERROR_LOGGER:
        return _concatInstanceProperty(_context = []).call(_context, _toConsumableArray(state), [handleError({
          payload: action.payload,
          type: 'danger'
        })]);

      default:
        return state;
    }
  };
};
export var selectErrors = R.propOr(initState, 'errors');