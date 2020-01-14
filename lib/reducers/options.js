'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectOptions = exports.generateOptionsReducer = undefined;

var _actionConsts = require('../actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _conveyor = require('conveyor');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initState = {};

var generateOptionsReducer = exports.generateOptionsReducer = function generateOptionsReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

    var payload = action.payload;
    switch (action.type) {
      case Actions.MENU_OPEN:
        {
          var _payload = { ...payload },
              modelName = _payload.modelName,
              fieldName = _payload.fieldName,
              rawData = _payload.rawData;

          // get schema data about the field

          var field1 = (0, _conveyor.getField)(schema, modelName, fieldName);

          // get the target model from the field:
          var targetModel = R.path(['type', 'target'], field1);

          // get drop-down options
          var options = rawData.map(function (node) {
            return {
              label: (0, _conveyor.getDisplayValue)({ schema: schema, modelName: targetModel, node: node }),
              value: R.prop('id', node)
            };
          });

          return R.assocPath([modelName, fieldName], options, state);
        }

      default:
        return state;
    }
  };
};

var selectOptions = exports.selectOptions = function selectOptions(state) {
  return R.prop('options', state);
};