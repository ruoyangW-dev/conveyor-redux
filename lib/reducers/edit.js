import "core-js/modules/es.date.to-string";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.regexp.to-string";
import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import * as R from 'ramda';
import * as Actions from '../actionConsts';
import { getDisplayValue, getField } from 'conveyor';
import { LOCATION_CHANGE } from 'connected-react-router';
var initState = {};

var getEditValue = function getEditValue(schema, _ref) {
  var modelName = _ref.modelName,
      fieldName = _ref.fieldName,
      value = _ref.value;
  var field = getField(schema, modelName, fieldName);
  var fieldType = R.prop('type', field);

  if (R.type(fieldType) === 'Object') {
    var type = R.prop('type', fieldType);
    var relModelName = R.prop('target', fieldType);

    if (_includesInstanceProperty(type).call(type, 'ToMany')) {
      return _mapInstanceProperty(value).call(value, function (node) {
        var displayName = getDisplayValue({
          schema: schema,
          modelName: relModelName,
          node: node
        });
        var id = R.prop('id', node);
        return {
          label: displayName,
          value: id
        };
      });
    } else if (_includesInstanceProperty(type).call(type, 'ToOne')) {
      if (R.isNil(value)) {
        return null;
      }

      return {
        label: getDisplayValue({
          schema: schema,
          modelName: relModelName,
          node: value
        }),
        value: R.prop('id', value)
      };
    } else {
      return R.prop('id', value);
    }
  } else if (fieldType === 'enum') {
    if (R.isNil(value)) {
      return null;
    }

    return {
      label: R.path(['choices', value], field),
      value: value
    };
  }

  return value;
};

export var generateEditReducer = function generateEditReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var payload = action.payload;

    switch (action.type) {
      case LOCATION_CHANGE:
        return initState;

      case Actions.TABLE_ROW_EDIT:
        {
          var _payload = _Object$assign({}, payload),
              modelName = _payload.modelName,
              id = _payload.id,
              node = _payload.node;

          var nodeFlattened = R.mapObjIndexed(function (value, fieldName) {
            var editValue = getEditValue(schema, {
              modelName: modelName,
              fieldName: fieldName,
              value: value
            });
            return {
              currentValue: editValue,
              initialValue: editValue
            };
          }, node); // if id is int, assocPath() creates list instead of object

          return R.assocPath([modelName, id.toString()], nodeFlattened, state);
        }

      case Actions.ATTRIBUTE_EDIT:
        {
          var _payload2 = _Object$assign({}, payload),
              _modelName = _payload2.modelName,
              _id = _payload2.id,
              fieldName = _payload2.fieldName,
              value = _payload2.value;

          var editValue = getEditValue(schema, {
            modelName: _modelName,
            fieldName: fieldName,
            value: value
          });
          var editState = {
            initialValue: editValue,
            currentValue: editValue
          };
          return R.assocPath([_modelName, _id.toString(), fieldName], editState, state);
        }

      case Actions.TABLE_EDIT_CANCEL:
        {
          var _payload3 = _Object$assign({}, payload),
              _modelName2 = _payload3.modelName,
              _id2 = _payload3.id;

          state = R.dissocPath([_modelName2, _id2], state); // if no ids for model are being edited, remove the model from the edit store

          if (R.isEmpty(R.prop(_modelName2, state))) {
            return R.dissoc(_modelName2, state);
          }

          return state;
        }

      case Actions.ATTRIBUTE_EDIT_CANCEL:
        {
          var _payload4 = _Object$assign({}, payload),
              _modelName3 = _payload4.modelName,
              _fieldName = _payload4.fieldName,
              _id3 = _payload4.id; // Remove the field from the edit store


          state = R.dissocPath([_modelName3, _id3, _fieldName], state); // if the instance of the model has no fields being edited, remove it from the store

          if (R.isEmpty(R.path([_modelName3, _id3], state))) {
            state = R.dissocPath([_modelName3, _id3], state);
          } // if no instances of the model are being edited, remove the model from the edit store


          if (R.isEmpty(R.prop(_modelName3, state))) {
            state = R.dissoc(_modelName3, state);
          }

          return state;
        }

      case Actions.VALIDATION_ERROR_EDIT:
        {
          var _payload5 = _Object$assign({}, payload),
              _modelName4 = _payload5.modelName,
              _id4 = _payload5.id,
              _fieldName2 = _payload5.fieldName,
              errors = _payload5.errors;

          R.forEach(function (fieldNameError) {
            if (fieldNameError === _fieldName2) {
              state = R.assocPath([_modelName4, _id4.toString(), fieldNameError, 'errors'], R.prop(fieldNameError, errors), state);
            }
          }, _Object$keys(errors));
          return state;
        }

      case Actions.DETAIL_TABLE_EDIT_SUBMIT:
        {
          var _payload6 = _Object$assign({}, payload),
              _modelName5 = _payload6.modelName,
              _id5 = _payload6.id;

          var fields = _Object$keys(R.path([_modelName5, _id5], state));

          R.forEach(function (f) {
            state = R.dissocPath(R.concat([_modelName5, _id5], [f, 'errors']), state);
          }, fields);
          return state;
        }

      case Actions.DETAIL_ATTRIBUTE_EDIT_SUBMIT:
        {
          var _payload7 = _Object$assign({}, payload),
              _modelName6 = _payload7.modelName,
              _id6 = _payload7.id,
              _fieldName3 = _payload7.fieldName;

          return R.dissocPath([_modelName6, _id6, _fieldName3, 'errors'], state);
        }

      case Actions.EDIT_INPUT_CHANGE:
        {
          var _payload8 = _Object$assign({}, payload),
              _modelName7 = _payload8.modelName,
              _id7 = _payload8.id,
              _fieldName4 = _payload8.fieldName,
              _value = _payload8.value;

          return R.assocPath([_modelName7, _id7.toString(), _fieldName4, 'currentValue'], _value, state);
        }

      case Actions.VALIDATION_ERROR_TABLE_ROW:
        {
          var _payload9 = _Object$assign({}, payload),
              _modelName8 = _payload9.modelName,
              _id8 = _payload9.id,
              _errors = _payload9.errors;

          R.forEach(function (fieldNameError) {
            state = R.assocPath([_modelName8, _id8.toString(), fieldNameError, 'errors'], R.prop(fieldNameError, _errors), state);
          }, _Object$keys(_errors));
          return state;
        }

      default:
        return state;
    }
  };
};
export var selectEdit = function selectEdit(state) {
  return R.prop('edit', state);
};