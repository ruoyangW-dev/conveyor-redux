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
    var fieldName = R.prop('fieldName', action);
    var modelName = R.prop('modelName', payload);
    var value = R.prop('value', payload);

    switch (action.type) {
      case Actions.MENU_OPEN:
        {
          var _payload = _Object$assign({}, payload),
              _modelName = _payload.modelName,
              _fieldName = _payload.fieldName,
              rawData = _payload.rawData; // get schema data about the field


          var field1 = getField(schema, _modelName, _fieldName); // get the target model from the field:

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

          return R.assocPath([_modelName, _fieldName], options, state);
        }

      case Actions.DATA_OPTIONS_UPDATE:
        {
          var targetModelName = R.path(['type', 'target'], getField(schema, modelName, fieldName));

          var _options = _mapInstanceProperty(value).call(value, function (option) {
            return {
              label: getDisplayValue({
                schema: schema,
                modelName: targetModelName,
                node: option
              }),
              value: R.prop('id', option)
            };
          });

          return R.assocPath([modelName, fieldName], _options, state);
        }

      case Actions.EXISTING_VALUE_UPDATE:
        {
          var _options2 = _mapInstanceProperty(value).call(value, function (option) {
            return {
              label: option,
              value: option
            };
          });

          return R.assocPath([modelName, fieldName], _options2, state);
        }

      default:
        return state;
    }
  };
};
export var selectOptions = function selectOptions(state) {
  return R.prop('options', state);
};