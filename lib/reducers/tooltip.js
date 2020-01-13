'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectTooltip = exports.generateTooltipReducer = exports.isOneToMany = exports.isManyToOne = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _actionConsts = require('../actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

var _conveyor = require('conveyor');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initState = [];

var isManyToOne = exports.isManyToOne = function isManyToOne(field) {
  return R.pathOr(false, ['type', 'type'], field) === 'ManyToOne';
};

var isOneToMany = exports.isOneToMany = function isOneToMany(field) {
  return R.pathOr(false, ['type', 'type'], field) === 'OneToMany';
};

var generateTooltipReducer = exports.generateTooltipReducer = function generateTooltipReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

    var payload = R.prop('payload', action);
    switch (action.type) {
      case Actions.TOOLTIP_OPEN:
        {
          var id = R.prop('id', payload);
          var modelName = R.prop('modelName', payload);
          var rawData = R.prop('rawData', payload);

          // example of what tooltip data would look like
          // modelName => [list of id's] => [list object attributes]
          var tooltipData = [];

          // get fields that should appear in tooltip
          // >>> ["name", "description"]
          var showTooltipFields = (0, _conveyor.getTooltipFields)(schema, modelName);

          R.mapObjIndexed(function (value, name, obj) {
            var field = (0, _conveyor.getField)(schema, modelName, name);
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
                var values = value.map(function (node) {
                  var text = (0, _conveyor.getDisplayValue)({
                    schema: schema,
                    modelName: relModelName,
                    node: node
                  });
                  return {
                    text: text,
                    url: '/' + relModelName + '/' + R.prop('id', node)
                  };
                });
                tooltipData.push({
                  name: name,
                  value: values
                });
              } else if (isManyToOne(field)) {
                var _relModelName = R.path(['type', 'target'], field);
                var text = (0, _conveyor.getDisplayValue)({
                  schema: schema,
                  modelName: _relModelName,
                  node: value
                });
                tooltipData.push({
                  name: name,
                  value: [{
                    text: text,
                    url: '/' + _relModelName + '/' + R.prop('id', value)
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

      default:
        return state;
    }
  };
};

var selectTooltip = exports.selectTooltip = R.propOr(initState, 'tooltip');