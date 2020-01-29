import { generateAlertReducer } from './alerts';
import { generateCreateReducer } from './create';
import { generateEditReducer } from './edit';
import { generateModalReducer } from './modal';
import { generateModelReducer } from './model';
import { generateOptionsReducer } from './options';
import { generateTooltipReducer } from './tooltip';
import { generateTableViewReducer } from './tableView';
import { generateSearchReducer } from './search';
export var generateConveyorReducers = function generateConveyorReducers(schema) {
  var alerts = generateAlertReducer(schema);
  var create = generateCreateReducer(schema);
  var edit = generateEditReducer(schema);
  var modal = generateModalReducer(schema);
  var model = generateModelReducer(schema);
  var options = generateOptionsReducer(schema);
  var tooltip = generateTooltipReducer(schema);
  var tableView = generateTableViewReducer(schema);
  var search = generateSearchReducer(schema);
  return {
    alerts: alerts,
    create: create,
    edit: edit,
    modal: modal,
    model: model,
    options: options,
    search: search,
    tooltip: tooltip,
    tableView: tableView
  };
};