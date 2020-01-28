import { generateCreateReducer } from './create';
import { generateEditReducer } from './edit';
import { generateModalReducer } from './modal';
import { generateOptionsReducer } from './options';
import { generateTooltipReducer } from './tooltip';
import { generateTableViewReducer } from './tableView';
import { generateModelReducer } from './model';
import { generateSearchReducer } from './search';
export var generateConveyorReducers = function generateConveyorReducers(schema) {
  var create = generateCreateReducer(schema);
  var edit = generateEditReducer(schema);
  var modal = generateModalReducer(schema);
  var options = generateOptionsReducer(schema);
  var tooltip = generateTooltipReducer(schema);
  var tableView = generateTableViewReducer(schema);
  var model = generateModelReducer(schema);
  var search = generateSearchReducer(schema);
  return {
    create: create,
    edit: edit,
    modal: modal,
    options: options,
    tooltip: tooltip,
    tableView: tableView,
    model: model,
    search: search
  };
};