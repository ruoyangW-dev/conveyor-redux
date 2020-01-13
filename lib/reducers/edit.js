'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectEdit = exports.generateEditReducer = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _actionConsts = require('../actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

var _conveyor = require('conveyor');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initState = {};

var getEditValue = function getEditValue(schema, _ref) {
  var modelName = _ref.modelName,
      fieldName = _ref.fieldName,
      value = _ref.value;

  var field = (0, _conveyor.getField)(schema, modelName, fieldName);
  var fieldType = R.prop('type', field);
  if (R.type(fieldType) === 'Object') {
    var type = R.prop('type', fieldType);
    var relModelName = R.prop('target', fieldType);
    if (type.includes('ToMany')) {
      return value.map(function (node) {
        var displayName = (0, _conveyor.getDisplayValue)({
          schema: schema,
          modelName: relModelName,
          node: node
        });
        var id = R.prop('id', node);
        return { label: displayName, value: id };
      });
    } else if (type.includes('ToOne')) {
      if (R.isNil(value)) {
        return null;
      }
      return {
        label: (0, _conveyor.getDisplayValue)({
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
    return { label: R.path(['choices', value], field), value: value };
  }
  return value;
};

var generateEditReducer = exports.generateEditReducer = function generateEditReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

    var payload = action.payload;
    switch (action.type) {
      case Actions.TABLE_ROW_EDIT:
        {
          var _payload = { ...payload },
              modelName = _payload.modelName,
              id = _payload.id,
              node = _payload.node;

          var nodeFlattened = R.mapObjIndexed(function (value, fieldName) {
            var editValue = getEditValue(schema, { modelName: modelName, fieldName: fieldName, value: value });
            return {
              currentValue: editValue,
              initialValue: editValue
            };
          }, node);
          // if id is int, assocPath() creates list instead of object
          return R.assocPath([modelName, id.toString()], nodeFlattened, state);
        }
      case Actions.ATTRIBUTE_EDIT:
        {
          var _payload2 = { ...payload },
              _modelName = _payload2.modelName,
              _id = _payload2.id,
              fieldName = _payload2.fieldName,
              value = _payload2.value;

          var editValue = getEditValue(schema, { modelName: _modelName, fieldName: fieldName, value: value });
          var editState = {
            initialValue: editValue,
            currentValue: editValue
          };
          return R.assocPath([_modelName, _id.toString(), fieldName], editState, state);
        }
      case Actions.TABLE_EDIT_CANCEL:
        {
          var _payload3 = { ...payload },
              _modelName2 = _payload3.modelName,
              _id2 = _payload3.id;

          return R.dissocPath([_modelName2, _id2], state);
        }
      case Actions.ATTRIBUTE_EDIT_CANCEL:
        {
          var _payload4 = { ...payload },
              _modelName3 = _payload4.modelName,
              _fieldName = _payload4.fieldName,
              _id3 = _payload4.id;

          // Remove the field from the edit store

          return R.dissocPath([_modelName3, _id3, _fieldName], state);
        }
      case Actions.INDEX_EDIT_SUBMIT:
        {
          var _modelName4 = R.prop('modelName', payload);
          var _id4 = R.prop('id', payload);

          // use 'rawEditValues' to save data in backend...
          var rawEditValues = R.path([_modelName4, _id4], state);
          console.log('INDEX EDIT SUBMIT', rawEditValues);

          // on success, delete value from edit
          return R.dissocPath([_modelName4, _id4], state);
        }
      case Actions.DETAIL_TABLE_EDIT_SUBMIT:
        {
          var _modelName5 = R.prop('modelName', payload);
          var _id5 = R.prop('id', payload);

          // use 'rawEditValues' to save data in backend...
          var _rawEditValues = R.path([_modelName5, _id5], state);
          console.log('DETAIL TABLE EDIT SUBMIT', _rawEditValues);

          // on success, delete value from edit
          return R.dissocPath([_modelName5, _id5], state);
        }
      case Actions.DETAIL_ATTRIBUTE_SUBMIT:
        {
          var _modelName6 = R.prop('modelName', payload);
          var _id6 = R.prop('id', payload);

          // use 'rawEditValues' to save data in backend...
          var _rawEditValues2 = R.path([_modelName6, _id6], state);
          console.log('DETAIL ATTRIBUTE SUBMIT', _rawEditValues2);

          // on success, delete value from edit
          return R.dissocPath([_modelName6, _id6], state);
        }
      case Actions.EDIT_INPUT_CHANGE:
        {
          var _payload5 = { ...payload },
              _modelName7 = _payload5.modelName,
              _id7 = _payload5.id,
              _fieldName2 = _payload5.fieldName,
              _value = _payload5.value;


          return R.assocPath([_modelName7, _id7.toString(), _fieldName2, 'currentValue'], _value, state);
        }
      case Actions.FILE_SUBMIT:
        {
          // handle file here
          return state;
        }
      default:
        return state;
    }
  };
};

var selectEdit = exports.selectEdit = function selectEdit(state) {
  return R.prop('edit', state);
};