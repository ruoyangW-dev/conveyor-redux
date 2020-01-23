import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import * as Actions from '../actionConsts';
import * as R from 'ramda';
import { getDisplayValue, getField } from 'conveyor';
var initState = {};
export var generateOptionsReducer = function generateOptionsReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var payload = action.payload;

    switch (action.type) {
      case Actions.MENU_OPEN:
        {
          var _payload = _Object$assign({}, payload),
              modelName = _payload.modelName,
              fieldName = _payload.fieldName,
              rawData = _payload.rawData; // get schema data about the field


          var field1 = getField(schema, modelName, fieldName); // get the target model from the field:

          var targetModel = R.path(['type', 'target'], field1); // get drop-down options

          var options = _mapInstanceProperty(rawData).call(rawData, function (node) {
            return {
              label: getDisplayValue({
                schema: schema,
                modelName: targetModel,
                node: node
              }),
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
export var selectOptions = function selectOptions(state) {
  return R.prop('options', state);
};