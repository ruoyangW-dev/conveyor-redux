import "core-js/modules/es.array.join";
import _JSON$stringify from "@babel/runtime-corejs3/core-js-stable/json/stringify";
import _defineProperty from "@babel/runtime-corejs3/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime-corejs3/helpers/esm/slicedToArray";
import _Object$entries from "@babel/runtime-corejs3/core-js-stable/object/entries";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _toConsumableArray from "@babel/runtime-corejs3/helpers/esm/toConsumableArray";
import _sliceInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/slice";
import _typeof from "@babel/runtime-corejs3/helpers/esm/typeof";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import { getField, getFields, getFieldLabel, inputTypes, getType, isRel, storeValueToArrayBuffer } from 'conveyor';
import * as R from 'ramda';
import * as consts from '../actionConsts';
import * as Logger from './Logger';
export var getFilters = function getFilters(_ref) {
  var schema = _ref.schema,
      modelName = _ref.modelName,
      tableView = _ref.tableView;
  var fields = getFields(schema, modelName);

  var getFieldFilter = function getFieldFilter(field) {
    var fieldName = R.prop('fieldName', field);
    var operator = R.path([modelName, 'filter', 'filterValue', fieldName, 'operator', 'value'], tableView);
    var value = R.path([modelName, 'filter', 'filterValue', fieldName, 'value'], tableView);

    if (operator && field.type === inputTypes.BOOLEAN_TYPE) {
      return {
        operator: operator,
        value: R.isNil(value) ? false : value
      };
    }

    if (operator && !R.isNil(value) && !R.isEmpty(value)) {
      if (isRel(field)) {
        var inputType = getType({
          schema: schema,
          modelName: modelName,
          fieldName: fieldName
        });

        if (inputType === inputTypes.ONE_TO_ONE_TYPE || inputType === inputTypes.MANY_TO_ONE_TYPE) {
          return {
            operator: operator,
            value: R.propOr(value, 'value', value)
          };
        }

        return {
          operator: operator,
          value: _mapInstanceProperty(value).call(value, function (val) {
            return val.value;
          })
        };
      }

      if (field.type === inputTypes.ENUM_TYPE) {
        return {
          operator: operator,
          value: value.value
        };
      }

      return {
        operator: operator,
        value: value
      };
    }

    return undefined;
  };

  var filters = R.map(getFieldFilter, fields); // filterFields: default filters, in addition filters set by user; always active

  var defaultFilters = R.path([modelName, 'filterFields'], schema);

  if (defaultFilters) {
    filters = R.merge(filters, defaultFilters);
  }

  return R.filter(R.identity, filters);
};
export var getSort = function getSort(_ref2) {
  var schema = _ref2.schema,
      modelName = _ref2.modelName,
      tableView = _ref2.tableView;

  // get sort from user input
  if (tableView) {
    var sortKey = R.path([modelName, 'sort', 'sortKey'], tableView);
    var fieldName = R.path([modelName, 'sort', 'fieldName'], tableView);

    if (sortKey && fieldName) {
      var _context;

      return [_concatInstanceProperty(_context = "".concat(fieldName, "_")).call(_context, sortKey)];
    }
  } // otherwise, get default sort from schema
  // sortFields: camel-case fields followed by '_asc' or '_desc'.


  return R.path([modelName, 'sortFields'], schema);
};
export var editFieldToQueryInput = function editFieldToQueryInput(_ref3) {
  var schema = _ref3.schema,
      modelName = _ref3.modelName,
      fieldName = _ref3.fieldName,
      value = _ref3.value,
      type = _ref3.type;

  if (type === undefined) {
    type = getType({
      schema: schema,
      modelName: modelName,
      fieldName: fieldName
    });
  }

  if (fieldName === '__typename') {
    return;
  }

  if (_includesInstanceProperty(type).call(type, 'ToMany')) {
    if (R.isNil(value)) {
      return [];
    }

    return _mapInstanceProperty(value).call(value, function (value) {
      return R.prop('value', value);
    });
  } else if (_includesInstanceProperty(type).call(type, 'ToOne')) {
    return R.propOr(null, 'value', value);
  } else if (type === 'enum') {
    return R.propOr(null, 'value', value);
  } else if (type === 'file') {
    if (R.isNil(value)) {
      return value;
    }

    return storeValueToArrayBuffer(value);
  } else if (type === 'boolean') {
    return _typeof(value) === _typeof(false) ? value : false;
  }

  return value;
};
export var isValidationError = function isValidationError(response) {
  return R.prop('status', response) === 200;
};

var errorMap = function errorMap(_ref4) {
  var schema = _ref4.schema,
      type = _ref4.type,
      fields = _ref4.fields,
      modelName = _ref4.modelName;
  var fieldNames = [];
  R.forEach(function (field) {
    fieldNames = R.append(getFieldLabel({
      schema: schema,
      modelName: modelName,
      fieldName: field
    }), fieldNames);
  }, fields);

  switch (type) {
    case consts.UNIQUE_CONSTRAINT:
      {
        var _context2;

        var len = fieldNames.length;
        var extra = '';

        if (len > 1) {
          extra = "combination of ".concat(_sliceInstanceProperty(fieldNames).call(fieldNames, 0, fieldNames.length - 1).join(', '), " and ");
        }

        var last = fieldNames[fieldNames.length - 1];
        return _concatInstanceProperty(_context2 = "This ".concat(extra)).call(_context2, last, " already exists.");
      }

    case consts.INCORRECT_DATA_SOURCE_SYSTEM_TYPE:
      return 'Source and Destination must be on the same System.';

    case consts.INCORRECT_REQUIREMENT_PARENT_TYPE:
      return 'Cannot add this Requirement as a Parent (incompatible type).';

    case consts.INCORRECT_REQUIREMENT_JMET_TYPE:
      return 'Cannot add JMET to Requirement with type "Business".';

    default:
      return null;
  }
};

var getValidationMessage = function getValidationMessage(_ref5) {
  var schema = _ref5.schema,
      context = _ref5.context,
      parsedErrors = _ref5.parsedErrors;
  return R.mapObjIndexed(function (fieldErrors, key) {
    var errorsList = [];
    R.forEach(function (e) {
      var message = errorMap({
        type: R.prop('type', e),
        fieldName: key,
        fields: R.prop('group', e),
        modelName: R.prop('modelName', context),
        schema: schema
      });

      if (message) {
        errorsList = R.append(message, errorsList);
      }
    }, fieldErrors);
    return errorsList;
  }, parsedErrors);
};

var parseValidationErrors = function parseValidationErrors(response) {
  var errorsStr = R.path(['errors', 0, 'message'], response);
  var errors = [];

  try {
    errors = JSON.parse(errorsStr);
  } catch (e) {
    Logger.inputValidationParseValidationErrors(response, e);
  }

  return errors;
};

export var prepValidationErrors = function prepValidationErrors(_ref6) {
  var schema = _ref6.schema,
      context = _ref6.context,
      error = _ref6.error;
  var parsedErrors = parseValidationErrors(error.response);
  return getValidationMessage({
    schema: schema,
    context: context,
    parsedErrors: parsedErrors
  });
};
export var getEditMutationInputVariables = function getEditMutationInputVariables(_ref7) {
  var schema = _ref7.schema,
      modelName = _ref7.modelName,
      node = _ref7.node;
  return R.pipe(R.mapObjIndexed(function (value, fieldName) {
    return editFieldToQueryInput({
      schema: schema,
      modelName: modelName,
      fieldName: fieldName,
      value: value
    });
  }), R.dissoc('__typename'), R.dissoc('id'))(node);
};
export var getDeleteErrors = function getDeleteErrors(_ref8) {
  var data = _ref8.data,
      context = _ref8.context;
  return R.path(['delete' + context.modelName, 'errors'], data);
};

var getInputValue = function getInputValue(fieldName, formStack) {
  var index = R.prop('index', formStack);
  return R.path(['stack', index, 'fields', fieldName], formStack);
}; // get input values from a create form


export var getCreateSubmitValues = function getCreateSubmitValues(_ref9) {
  var _context3, _context4;

  var schema = _ref9.schema,
      formStack = _ref9.formStack,
      modelName = _ref9.modelName;
  var createFields = R.filter(function (field) {
    return R.propOr(true, 'showCreate', field);
  }, getFields(schema, modelName));
  var formStackIndex = R.prop('index', formStack);
  var origin = R.prop('originModelName', formStack);

  if (origin && formStackIndex === 0) {
    var originFieldName = R.prop('originFieldName', formStack);
    createFields[originFieldName] = originFieldName;
  }

  var inputs = _Object$assign.apply(Object, _concatInstanceProperty(_context3 = [{}]).call(_context3, _toConsumableArray(_mapInstanceProperty(_context4 = _Object$entries(createFields)).call(_context4, function (_ref10) {
    var _ref11 = _slicedToArray(_ref10, 1),
        fieldName = _ref11[0];

    return _defineProperty({}, fieldName, editFieldToQueryInput({
      schema: schema,
      modelName: modelName,
      fieldName: fieldName,
      value: getInputValue(fieldName, formStack)
    }));
  }))));

  return R.pickBy(function (_, fieldName) {
    // Ignore fields who have submitCreate as false,
    // defaults to true
    return R.propOr(true, 'submitCreate', getField(schema, modelName, fieldName));
  }, inputs);
};
export var fileSubmitToBlob = function fileSubmitToBlob(_ref13) {
  var payload = _ref13.payload,
      query = _ref13.query,
      value = _ref13.value;
  var formData = new FormData();
  var modelName = R.prop('modelName', payload);
  var fieldName = R.prop('fieldName', payload);
  var id = R.prop('id', payload);
  var fileData = R.propOr(false, 'fileData', payload);
  var variableInputDict;
  var fileInputDict;

  if (fileData) {
    variableInputDict = R.map(function () {
      return consts.CREATE_FILE;
    }, fileData);
    fileInputDict = fileData;
  } else if (value) {
    variableInputDict = _defineProperty({}, fieldName, consts.CREATE_FILE); // type needed => reconciliation is not in schema

    var arrayBuffer = editFieldToQueryInput({
      modelName: modelName,
      fieldName: fieldName,
      value: value,
      type: inputTypes.FILE_TYPE
    });
    fileInputDict = _defineProperty({}, fieldName, arrayBuffer);
  }

  if (query) {
    formData.append('query', query);
  }

  var variables = _JSON$stringify({
    id: id,
    input: variableInputDict
  });

  formData.append('variables', variables);

  for (var _i = 0, _Object$entries2 = _Object$entries(fileInputDict); _i < _Object$entries2.length; _i++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i], 2),
        _fieldName = _Object$entries2$_i[0],
        contents = _Object$entries2$_i[1];

    formData.append(_fieldName, new Blob([contents], {
      type: 'application/octet-stream'
    }), _fieldName);
  }

  return formData;
};