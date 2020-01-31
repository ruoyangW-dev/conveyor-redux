import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import { getFields, inputTypes, getInputType, isRel } from 'conveyor';
import * as R from 'ramda';
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
        if (getInputType({
          schema: schema,
          modelName: modelName,
          fieldName: fieldName
        }) === inputTypes.RELATIONSHIP_SINGLE) {
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