import { generateCreateReducer } from './create';
import { generateEditReducer } from './edit';
import { generateLoggerReducer } from './logger';
import { generateModalReducer } from './modal';
import { generateModelReducer } from './model';
import { generateOptionsReducer } from './options';
import { generateTooltipReducer } from './tooltip';
import { generateTableViewReducer } from './tableView';
export var generateConveyorReducers = function generateConveyorReducers(schema) {
  var create = generateCreateReducer(schema);
  var edit = generateEditReducer(schema);
  var logger = generateLoggerReducer(schema);
  var modal = generateModalReducer(schema);
  var model = generateModelReducer(schema);
  var options = generateOptionsReducer(schema);
  var tooltip = generateTooltipReducer(schema);
  var tableView = generateTableViewReducer(schema);
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