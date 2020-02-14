import * as Actions from './actionConsts';
export var actionDisp = function actionDisp(type) {
  return function (payload) {
    return {
      type: type,
      payload: payload
    };
  };
}; // delete

export var updateDeleteDetail = actionDisp(Actions.UPDATE_DELETE_DETAIL);
export var cancelDeleteDetail = actionDisp(Actions.CANCEL_DELETE_DETAIL);
export var fetchDeleteDetail = actionDisp(Actions.FETCH_DELETE_DETAIL); // edit

export var onTableRowEdit = actionDisp(Actions.TABLE_ROW_EDIT);
export var onAttributeEdit = actionDisp(Actions.ATTRIBUTE_EDIT);
export var onTableEditCancel = actionDisp(Actions.TABLE_EDIT_CANCEL);
export var onAttributeEditCancel = actionDisp(Actions.ATTRIBUTE_EDIT_CANCEL);
export var onIndexEditSubmit = actionDisp(Actions.INDEX_EDIT_SUBMIT);
export var onDetailTableEditSubmit = actionDisp(Actions.DETAIL_TABLE_EDIT_SUBMIT);
export var onDetailAttributeSubmit = actionDisp(Actions.DETAIL_ATTRIBUTE_EDIT_SUBMIT);
export var onEditInputChange = actionDisp(Actions.EDIT_INPUT_CHANGE);
export var onInlineFileSubmit = actionDisp(Actions.INLINE_FILE_SUBMIT);
export var onInlineFileDelete = actionDisp(Actions.INLINE_FILE_DELETE);
export var onValidationErrorEdit = actionDisp(Actions.VALIDATION_ERROR_EDIT);
export var onValidationErrorTableRow = actionDisp(Actions.VALIDATION_ERROR_TABLE_ROW);
export var onDetailTableRemoveSubmit = actionDisp(Actions.DETAIL_TABLE_REMOVE_SUBMIT); // input

export var onMenuOpen = actionDisp(Actions.MENU_OPEN); // create

export var onCreateInputChange = actionDisp(Actions.CREATE_INPUT_CHANGE);
export var onCancelCreate = actionDisp(Actions.CANCEL_CREATE);
export var onSaveCreate = actionDisp(Actions.SAVE_CREATE);
export var onSaveCreateSuccessful = actionDisp(Actions.SAVE_CREATE_SUCCESSFUL);
export var onStackCreate = actionDisp(Actions.STACK_CREATE);
export var onDetailCreate = actionDisp(Actions.DETAIL_CREATE);
export var onIndexCreate = actionDisp(Actions.INDEX_CREATE);
export var onUpdateFormStackIndex = actionDisp(Actions.UPDATE_FORM_STACK_INDEX);
export var onValidationErrorCreate = actionDisp(Actions.VALIDATION_ERROR_CREATE); // tooltip

export var onTooltipOpen = actionDisp(Actions.TOOLTIP_OPEN);
export var fetchModelTooltip = actionDisp(Actions.FETCH_MODEL_TOOLTIP);
export var updateModelTooltip = actionDisp(Actions.UPDATE_MODEL_TOOLTIP); // tableView

export var changePage = actionDisp(Actions.CHANGE_PAGE);
export var collapseTableChange = actionDisp(Actions.COLLAPSE_TABLE_CHANGE);
export var indexAddFilter = actionDisp(Actions.INDEX_ADD_FILTER);
export var indexClearFilters = actionDisp(Actions.INDEX_CLEAR_FILTERS);
export var indexChangeFilterField = actionDisp(Actions.INDEX_CHANGE_FILTER_FIELD);
export var indexDeleteFilter = actionDisp(Actions.INDEX_DELETE_FILTER);
export var indexTableFilterChange = actionDisp(Actions.INDEX_TABLE_FILTER_CHANGE);
export var indexTableFilterSubmit = actionDisp(Actions.INDEX_TABLE_FILTER_SUBMIT);
export var indexTableFilterDropdown = actionDisp(Actions.INDEX_TABLE_FILTER_DROPDOWN);
export var indexTableSortChange = actionDisp(Actions.INDEX_TABLE_SORT_CHANGE);
export var updateOverviewDisplayed = actionDisp(Actions.UPDATE_OVERVIEW_DISPLAYED);
export var updateOverviewSelected = actionDisp(Actions.UPDATE_OVERVIEW_SELECTED);
export var changeRelTablePage = actionDisp(Actions.CHANGE_REL_TABLE_PAGE); // model

export var fetchModelDetail = actionDisp(Actions.FETCH_MODEL_DETAIL);
export var fetchModelIndex = actionDisp(Actions.FETCH_MODEL_INDEX);
export var updateModelDetail = actionDisp(Actions.UPDATE_MODEL_DETAIL);
export var updateModelIndex = actionDisp(Actions.UPDATE_MODEL_INDEX);
export var requestDeleteModel = actionDisp(Actions.REQUEST_DELETE_MODEL);
export var updateDeleteModel = actionDisp(Actions.UPDATE_DELETE_MODEL);
export var requestDeleteRelTableModel = actionDisp(Actions.REQUEST_DELETE_REL_TABLE_MODEL);
export var requestDeleteModelFromDetailPage = actionDisp(Actions.REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE);
export var removeInstance = actionDisp(Actions.REMOVE_INSTANCE); // search

export var fetchSearchEntries = actionDisp(Actions.FETCH_SEARCH_ENTRIES);
export var searchQueryTextChange = actionDisp(Actions.SEARCH_QUERY_TEXT_CHANGED);
export var searchQueryLinkClicked = actionDisp(Actions.SEARCH_QUERY_LINK_CLICKED);
export var updateSearchEntries = actionDisp(Actions.UPDATE_SEARCH_ENTRIES);
export var onSearchBlur = actionDisp(Actions.SEARCH_BLUR);
export var onTriggerSearch = actionDisp(Actions.TRIGGER_SEARCH); // options

export var dataOptionsUpdate = actionDisp(Actions.DATA_OPTIONS_UPDATE);
export var existingValueUpdate = actionDisp(Actions.EXISTING_VALUE_UPDATE);
export var querySelectMenuOpen = actionDisp(Actions.QUERY_SELECT_MENU_OPEN);
export var relationshipSelectMenuOpen = actionDisp(Actions.RELATIONSHIP_SELECT_MENU_OPEN); // alerts

export var addDangerAlert = actionDisp(Actions.ADD_DANGER_ALERT);
export var addSuccessAlert = actionDisp(Actions.ADD_SUCCESS_ALERT);