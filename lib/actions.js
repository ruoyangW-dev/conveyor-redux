<<<<<<< HEAD
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateModelIndex = exports.updateModelDetail = exports.fetchModelIndex = exports.fetchModelDetail = exports.errorLogger = exports.hideTableChange = exports.indexTableSortChange = exports.indexTableFilterDropdown = exports.indexTableFilterSubmit = exports.indexTableFilterChange = exports.indexDeleteFilter = exports.indexChangeFilterField = exports.indexClearFilters = exports.indexAddFilter = exports.onTooltipOpen = exports.onBreadcrumbClick = exports.onIndexCreate = exports.onDetailCreate = exports.onStackCreate = exports.onSaveSuccessful = exports.onSave = exports.onCancel = exports.onInputChange = exports.onMenuOpen = exports.onFileSubmit = exports.onEditInputChange = exports.onDetailAttributeSubmit = exports.onDetailTableEditSubmit = exports.onIndexEditSubmit = exports.onAttributeEditCancel = exports.onTableEditCancel = exports.onAttributeEdit = exports.onTableRowEdit = exports.onCancelDelete = exports.onDeleteWarning = exports.onDetailDeleteFromDetailPage = exports.onDetailDelete = exports.onIndexDelete = exports.actionDisp = undefined;

var _actionConsts = require('./actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var actionDisp = exports.actionDisp = function actionDisp(type) {
=======
import * as Actions from './actionConsts';
export var actionDisp = function actionDisp(type) {
>>>>>>> master
  return function (payload) {
    return {
      type: type,
      payload: payload
    };
  };
<<<<<<< HEAD
};

// delete

export var updateModelDetail = actionDisp(Actions.UPDATE_MODEL_DETAIL);
export var updateModelIndex = actionDisp(Actions.UPDATE_MODEL_INDEX);
