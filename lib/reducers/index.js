import { generateCreateReducer } from './create';
import { generateEditReducer } from './edit';
import { generateModalReducer } from './modal';
import { generateOptionsReducer } from './options';
import { generateTooltipReducer } from './tooltip';
import { generateTableViewReducer } from './tableView';
export var generateConveyorReducers = function generateConveyorReducers(schema) {
  var create = generateCreateReducer(schema);
  var edit = generateEditReducer(schema);
  var modal = generateModalReducer(schema);
  var options = generateOptionsReducer(schema);
  var tooltip = generateTooltipReducer(schema);
  var tableView = generateTableViewReducer(schema);
  return {
    create: create,
    edit: edit,
    modal: modal,
    options: options,
    tooltip: tooltip,
    tableView: tableView
  };
};