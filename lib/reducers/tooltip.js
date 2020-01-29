import "core-js/modules/es.date.to-string";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.regexp.to-string";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import * as R from 'ramda';
import * as Actions from '../actionConsts';
import { getDisplayValue, getField, getTooltipFields, getFieldLabel, getType, getEnumLabel, isManyToMany } from 'conveyor';
export var initState = [];
export var isManyToOne = function isManyToOne(field) {
  return R.pathOr(false, ['type', 'type'], field) === 'ManyToOne';
};
export var isOneToMany = function isOneToMany(field) {
  return R.pathOr(false, ['type', 'type'], field) === 'OneToMany';
};
export var generateTooltipReducer = function generateTooltipReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var payload = R.prop('payload', action);

    switch (action.type) {
      case Actions.TOOLTIP_OPEN:
        {
          var id = R.prop('id', payload);
          var modelName = R.prop('modelName', payload);
          var rawData = R.prop('rawData', payload); // example of what tooltip data would look like
          // modelName => [list of id's] => [list object attributes]

          var tooltipData = []; // get fields that should appear in tooltip
          // >>> ["name", "description"]

          var showTooltipFields = getTooltipFields(schema, modelName);
          R.mapObjIndexed(function (value, name) {
            var field = getField(schema, modelName, name);

            if (R.contains(name, showTooltipFields)) {
              // add values to 'tooltipData' in this format:
              // { name: <fieldName>, value: [{value}, ... ] }
              if (value === null) {
                tooltipData.push({
                  name: name,
                  value: [{
                    text: 'N/A'
                  }]
                });
              } else if (isOneToMany(field)) {
                var relModelName = R.path(['type', 'target'], field);

                var values = _mapInstanceProperty(value).call(value, function (node) {
                  var _context;

                  var text = getDisplayValue({
                    schema: schema,
                    modelName: relModelName,
                    node: node
                  });
                  return {
                    text: text,
                    url: _concatInstanceProperty(_context = "/".concat(relModelName, "/")).call(_context, R.prop('id', node))
                  };
                });

                tooltipData.push({
                  name: name,
                  value: values
                });
              } else if (isManyToOne(field)) {
                var _context2;

                var _relModelName = R.path(['type', 'target'], field);

                var text = getDisplayValue({
                  schema: schema,
                  modelName: _relModelName,
                  node: value
                });
                tooltipData.push({
                  name: name,
                  value: [{
                    text: text,
                    url: _concatInstanceProperty(_context2 = "/".concat(_relModelName, "/")).call(_context2, R.prop('id', value))
                  }]
                });
              } else {
                tooltipData.push({
                  name: name,
                  value: [{
                    text: value
                  }]
                });
              }
            }
          }, rawData);
          return R.assocPath([modelName, id.toString()], tooltipData, state);
        }

      case Actions.UPDATE_MODEL_TOOLTIP:
        {
          var _id = R.prop('id', payload);

          var _modelName = R.prop('modelName', payload);

          var result = R.path(['data', 'result'], payload);
          var _tooltipData = [];

          for (var fieldName in result) {
            var value = R.prop(fieldName, result);
            var name = getFieldLabel({
              schema: schema,
              modelName: _modelName,
              fieldName: fieldName
            });
            var type = getType({
              schema: schema,
              modelName: _modelName,
              fieldName: fieldName
            });
            var field = getField(schema, _modelName, fieldName);

            if (value === null) {
              _tooltipData.push({
                name: name,
                value: [{
                  text: 'N/A'
                }]
              });
            } else if (type === 'enum') {
              _tooltipData.push({
                name: name,
                value: [{
                  text: getEnumLabel({
                    schema: schema,
                    modelName: _modelName,
                    fieldName: fieldName,
                    value: value
                  })
                }]
              });
            } else if (isManyToMany(field)) {
              (function () {
                var relModelName = R.path(['type', 'target'], field);

                var values = _mapInstanceProperty(value).call(value, function (node) {
                  var _context3;

                  var text = getDisplayValue({
                    schema: schema,
                    modelName: relModelName,
                    node: node
                  });
                  return {
                    text: text,
                    url: _concatInstanceProperty(_context3 = "/".concat(relModelName, "/")).call(_context3, R.prop('id', node))
                  };
                });

                _tooltipData.push({
                  name: name,
                  value: values
                });
              })();
            } else if (isManyToOne(field)) {
              var _context4;

              var relModelName = R.path(['type', 'target'], getField(schema, _modelName, fieldName));
              var text = getDisplayValue({
                schema: schema,
                modelName: relModelName,
                node: value
              });

              _tooltipData.push({
                name: name,
                value: [{
                  text: text,
                  url: _concatInstanceProperty(_context4 = "/".concat(relModelName, "/")).call(_context4, R.prop('id', value))
                }]
              });
            } else {
              _tooltipData.push({
                name: name,
                value: [{
                  text: value
                }]
              });
            }
          }

          return R.assocPath([_modelName, _id.toString()], _tooltipData, state);
        }

      default:
        return state;
    }
  };
};
export var selectTooltip = R.propOr(initState, 'tooltip');