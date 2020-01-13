'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateConveyorReducers = undefined;

var _create = require('./reducers/create');

var _edit = require('./reducers/edit');

var _modal = require('./reducers/modal');

var _options = require('./reducers/options');

var _tooltip = require('./reducers/tooltip');

var generateConveyorReducers = exports.generateConveyorReducers = function generateConveyorReducers(schema) {
  var create = (0, _create.generateCreateReducer)(schema);
  var edit = (0, _edit.generateEditReducer)(schema);
  var modal = (0, _modal.generateModalReducer)(schema);
  var options = (0, _options.generateOptionsReducer)(schema);
  var tooltip = (0, _tooltip.generateTooltipReducer)(schema);

  return { create: create, edit: edit, modal: modal, options: options, tooltip: tooltip };
};