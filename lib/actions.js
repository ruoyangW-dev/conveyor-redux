'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideTableChange = exports.indexTableSortChange = exports.indexTableFilterDropdown = exports.indexTableFilterSubmit = exports.indexTableFilterChange = exports.indexDeleteFilter = exports.indexChangeFilterField = exports.indexClearFilters = exports.indexAddFilter = exports.onTooltipOpen = exports.onBreadcrumbClick = exports.onIndexCreate = exports.onDetailCreate = exports.onStackCreate = exports.onSaveSuccessful = exports.onSave = exports.onCancel = exports.onInputChange = exports.onMenuOpen = exports.onFileSubmit = exports.onEditInputChange = exports.onDetailAttributeSubmit = exports.onDetailTableEditSubmit = exports.onIndexEditSubmit = exports.onAttributeEditCancel = exports.onTableEditCancel = exports.onAttributeEdit = exports.onTableRowEdit = exports.onCancelDelete = exports.onDeleteWarning = exports.onDetailDeleteFromDetailPage = exports.onDetailDelete = exports.onIndexDelete = exports.actionDisp = undefined;

var _actionConsts = require('./actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var actionDisp = exports.actionDisp = function actionDisp(type) {
  return function (payload) {
    return { type: type, payload: payload };
  };
};

// delete

var onIndexDelete = exports.onIndexDelete = actionDisp(Actions.INDEX_DELETE);
var onDetailDelete = exports.onDetailDelete = actionDisp(Actions.DETAIL_DELETE);
var onDetailDeleteFromDetailPage = exports.onDetailDeleteFromDetailPage = actionDisp(Actions.DETAIL_DELETE_FROM_DETAIL_PAGE);
var onDeleteWarning = exports.onDeleteWarning = actionDisp(Actions.DELETE_WARNING);
var onCancelDelete = exports.onCancelDelete = actionDisp(Actions.CANCEL_DELETE);

// edit

var onTableRowEdit = exports.onTableRowEdit = actionDisp(Actions.TABLE_ROW_EDIT);
var onAttributeEdit = exports.onAttributeEdit = actionDisp(Actions.ATTRIBUTE_EDIT);
var onTableEditCancel = exports.onTableEditCancel = actionDisp(Actions.TABLE_EDIT_CANCEL);
var onAttributeEditCancel = exports.onAttributeEditCancel = actionDisp(Actions.ATTRIBUTE_EDIT_CANCEL);
var onIndexEditSubmit = exports.onIndexEditSubmit = actionDisp(Actions.INDEX_EDIT_SUBMIT);
var onDetailTableEditSubmit = exports.onDetailTableEditSubmit = actionDisp(Actions.DETAIL_TABLE_EDIT_SUBMIT);
var onDetailAttributeSubmit = exports.onDetailAttributeSubmit = actionDisp(Actions.DETAIL_ATTRIBUTE_SUBMIT);
var onEditInputChange = exports.onEditInputChange = actionDisp(Actions.EDIT_INPUT_CHANGE);
var onFileSubmit = exports.onFileSubmit = actionDisp(Actions.FILE_SUBMIT);

// input

var onMenuOpen = exports.onMenuOpen = actionDisp(Actions.MENU_OPEN);

// create

var onInputChange = exports.onInputChange = actionDisp(Actions.INPUT_CHANGE);
var onCancel = exports.onCancel = actionDisp(Actions.CANCEL);
var onSave = exports.onSave = actionDisp(Actions.SAVE);
var onSaveSuccessful = exports.onSaveSuccessful = actionDisp(Actions.SAVE_SUCCESSFUL);
var onStackCreate = exports.onStackCreate = actionDisp(Actions.STACK_CREATE);
var onDetailCreate = exports.onDetailCreate = actionDisp(Actions.DETAIL_CREATE);
var onIndexCreate = exports.onIndexCreate = actionDisp(Actions.INDEX_CREATE);
var onBreadcrumbClick = exports.onBreadcrumbClick = actionDisp(Actions.BREADCRUMB_CLICK);

// tooltip

var onTooltipOpen = exports.onTooltipOpen = actionDisp(Actions.TOOLTIP_OPEN);

// tableView

var indexAddFilter = exports.indexAddFilter = actionDisp(Actions.INDEX_ADD_FILTER);
var indexClearFilters = exports.indexClearFilters = actionDisp(Actions.INDEX_CLEAR_FILTERS);
var indexChangeFilterField = exports.indexChangeFilterField = actionDisp(Actions.INDEX_CHANGE_FILTER_FIELD);
var indexDeleteFilter = exports.indexDeleteFilter = actionDisp(Actions.INDEX_DELETE_FILTER);
var indexTableFilterChange = exports.indexTableFilterChange = actionDisp(Actions.INDEX_TABLE_FILTER_CHANGE);
var indexTableFilterSubmit = exports.indexTableFilterSubmit = actionDisp(Actions.INDEX_TABLE_FILTER_SUBMIT);
var indexTableFilterDropdown = exports.indexTableFilterDropdown = actionDisp(Actions.INDEX_TABLE_FILTER_DROPDOWN);
var indexTableSortChange = exports.indexTableSortChange = actionDisp(Actions.INDEX_TABLE_SORT_CHANGE);
var hideTableChange = exports.hideTableChange = actionDisp(Actions.HIDE_TABLE_CHANGE);