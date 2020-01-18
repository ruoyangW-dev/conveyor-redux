'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateConveyorReducers = undefined;

var _create = require('./create');

var _edit = require('./edit');

var _logger = require('./logger');

var _modal = require('./modal');

var _model = require('./model');

var _options = require('./options');

var _tooltip = require('./tooltip');

var _tableView = require('./tableView');

var generateConveyorReducers = exports.generateConveyorReducers = function generateConveyorReducers(schema) {
  var create = (0, _create.generateCreateReducer)(schema);
  var edit = (0, _edit.generateEditReducer)(schema);
  var logger = (0, _logger.generateErrorLogger)(schema);
  var modal = (0, _modal.generateModalReducer)(schema);
  var model = (0, _model.generateModelReducer)(schema);
  var options = (0, _options.generateOptionsReducer)(schema);
  var tooltip = (0, _tooltip.generateTooltipReducer)(schema);
  var tableView = (0, _tableView.generateTableViewReducer)(schema);

  return {
    create: create,
    edit: edit,
    logger: logger,
    modal: modal,
    model: model,
    options: options,
    tooltip: tooltip,
    tableView: tableView
  };
};