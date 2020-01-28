import * as Actions from './actionConsts'

export const actionDisp = type => payload => ({ type, payload })

// delete

export const onIndexDelete = actionDisp(Actions.INDEX_DELETE)
export const onDetailDelete = actionDisp(Actions.DETAIL_DELETE)
export const onDetailDeleteFromDetailPage = actionDisp(
  Actions.DETAIL_DELETE_FROM_DETAIL_PAGE
)
export const onDeleteWarning = actionDisp(Actions.DELETE_WARNING)
export const onCancelDelete = actionDisp(Actions.CANCEL_DELETE)

// edit

export const onTableRowEdit = actionDisp(Actions.TABLE_ROW_EDIT)
export const onAttributeEdit = actionDisp(Actions.ATTRIBUTE_EDIT)
export const onTableEditCancel = actionDisp(Actions.TABLE_EDIT_CANCEL)
export const onAttributeEditCancel = actionDisp(Actions.ATTRIBUTE_EDIT_CANCEL)
export const onIndexEditSubmit = actionDisp(Actions.INDEX_EDIT_SUBMIT)
export const onDetailTableEditSubmit = actionDisp(
  Actions.DETAIL_TABLE_EDIT_SUBMIT
)
export const onDetailAttributeSubmit = actionDisp(
  Actions.DETAIL_ATTRIBUTE_SUBMIT
)
export const onEditInputChange = actionDisp(Actions.EDIT_INPUT_CHANGE)
export const onFileSubmit = actionDisp(Actions.FILE_SUBMIT)

// input

export const onMenuOpen = actionDisp(Actions.MENU_OPEN)

// create

export const onInputChange = actionDisp(Actions.INPUT_CHANGE)
export const onCancel = actionDisp(Actions.CANCEL)
export const onSave = actionDisp(Actions.SAVE)
export const onSaveSuccessful = actionDisp(Actions.SAVE_SUCCESSFUL)
export const onStackCreate = actionDisp(Actions.STACK_CREATE)
export const onDetailCreate = actionDisp(Actions.DETAIL_CREATE)
export const onIndexCreate = actionDisp(Actions.INDEX_CREATE)
export const onBreadcrumbClick = actionDisp(Actions.BREADCRUMB_CLICK)

// tooltip

export const onTooltipOpen = actionDisp(Actions.TOOLTIP_OPEN)
export const fetchModelTooltip = actionDisp(Actions.FETCH_MODEL_TOOLTIP)
export const updateModelTooltip = actionDisp(Actions.UPDATE_MODEL_TOOLTIP)

// tableView

export const indexAddFilter = actionDisp(Actions.INDEX_ADD_FILTER)
export const indexClearFilters = actionDisp(Actions.INDEX_CLEAR_FILTERS)
export const indexChangeFilterField = actionDisp(
  Actions.INDEX_CHANGE_FILTER_FIELD
)
export const indexDeleteFilter = actionDisp(Actions.INDEX_DELETE_FILTER)
export const indexTableFilterChange = actionDisp(
  Actions.INDEX_TABLE_FILTER_CHANGE
)
export const indexTableFilterSubmit = actionDisp(
  Actions.INDEX_TABLE_FILTER_SUBMIT
)
export const indexTableFilterDropdown = actionDisp(
  Actions.INDEX_TABLE_FILTER_DROPDOWN
)
export const indexTableSortChange = actionDisp(Actions.INDEX_TABLE_SORT_CHANGE)
export const hideTableChange = actionDisp(Actions.HIDE_TABLE_CHANGE)

// epics

export const fetchModelDetail = actionDisp(Actions.FETCH_MODEL_DETAIL)
export const fetchModelIndex = actionDisp(Actions.FETCH_MODEL_INDEX)
export const changePage = actionDisp(Actions.CHANGE_PAGE)

// model

export const updateModelDetail = actionDisp(Actions.UPDATE_MODEL_DETAIL)
export const updateModelIndex = actionDisp(Actions.UPDATE_MODEL_INDEX)

// search

export const fetchSearchEntries = actionDisp(Actions.FETCH_SEARCH_ENTRIES)
export const searchQueryTextChange = actionDisp(Actions.SEARCH_QUERY_TEXT_CHANGED)
export const searchQueryLinkClicked = actionDisp(Actions.SEARCH_QUERY_LINK_CLICKED)
export const updateSearchEntries = actionDisp(Actions.UPDATE_SEARCH_ENTRIES)
export const onSearchBlur = actionDisp(Actions.SEARCH_BLUR)
export const onTriggerSearch = actionDisp(Actions.TRIGGER_SEARCH)
