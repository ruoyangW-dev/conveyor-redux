import * as ACTIONS from './actionTypes'

export const actionDisp = (type) => (payload) => ({ type, payload })

// delete

export const onIndexDelete = actionDisp(ACTIONS.INDEX_DELETE)
export const onDetailDelete = actionDisp(ACTIONS.DETAIL_DELETE)
export const onDetailDeleteFromDetailPage = actionDisp(ACTIONS.DETAIL_DELETE_FROM_DETAIL_PAGE)
export const onDeleteWarning = actionDisp(ACTIONS.DELETE_WARNING)
export const onCancelDelete = actionDisp(ACTIONS.CANCEL_DELETE)

// edit

export const onTableRowEdit = actionDisp(ACTIONS.TABLE_ROW_EDIT)
export const onAttributeEdit = actionDisp(ACTIONS.ATTRIBUTE_EDIT)
export const onTableEditCancel = actionDisp(ACTIONS.TABLE_EDIT_CANCEL)
export const onAttributeEditCancel = actionDisp(ACTIONS.ATTRIBUTE_EDIT_CANCEL)
export const onIndexEditSubmit = actionDisp(ACTIONS.INDEX_EDIT_SUBMIT)
export const onDetailTableEditSubmit = actionDisp(ACTIONS.DETAIL_TABLE_EDIT_SUBMIT)
export const onDetailAttributeSubmit = actionDisp(ACTIONS.DETAIL_ATTRIBUTE_SUBMIT)
export const onEditInputChange = actionDisp(ACTIONS.EDIT_INPUT_CHANGE)
export const onFileSubmit = actionDisp(ACTIONS.FILE_SUBMIT)

// input

export const onMenuOpen = actionDisp(ACTIONS.MENU_OPEN)

// create

export const onInputChange = actionDisp(ACTIONS.INPUT_CHANGE)
export const onCancel = actionDisp(ACTIONS.CANCEL)
export const onSave = actionDisp(ACTIONS.SAVE)
export const onStackCreate = actionDisp(ACTIONS.STACK_CREATE)
export const onDetailCreate = actionDisp(ACTIONS.DETAIL_CREATE)
export const onIndexCreate = actionDisp(ACTIONS.INDEX_CREATE)
export const onBreadcrumbClick = actionDisp(ACTIONS.BREADCRUMB_CLICK)

// tooltip

export const onTooltipOpen = actionDisp(ACTIONS.TOOLTIP_OPEN)
