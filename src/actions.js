import * as Actions from './actionConsts'

export const actionDisp = (type) => (payload) => ({ type, payload })

// delete

export const onIndexDelete = actionDisp(Actions.INDEX_DELETE)
export const onDetailDelete = actionDisp(Actions.DETAIL_DELETE)
export const onDetailDeleteFromDetailPage = actionDisp(Actions.DETAIL_DELETE_FROM_DETAIL_PAGE)
export const onDeleteWarning = actionDisp(Actions.DELETE_WARNING)
export const onCancelDelete = actionDisp(Actions.CANCEL_DELETE)

// edit

export const onTableRowEdit = actionDisp(Actions.TABLE_ROW_EDIT)
export const onAttributeEdit = actionDisp(Actions.ATTRIBUTE_EDIT)
export const onTableEditCancel = actionDisp(Actions.TABLE_EDIT_CANCEL)
export const onAttributeEditCancel = actionDisp(Actions.ATTRIBUTE_EDIT_CANCEL)
export const onIndexEditSubmit = actionDisp(Actions.INDEX_EDIT_SUBMIT)
export const onDetailTableEditSubmit = actionDisp(Actions.DETAIL_TABLE_EDIT_SUBMIT)
export const onDetailAttributeSubmit = actionDisp(Actions.DETAIL_ATTRIBUTE_SUBMIT)
export const onEditInputChange = actionDisp(Actions.EDIT_INPUT_CHANGE)
export const onFileSubmit = actionDisp(Actions.FILE_SUBMIT)

// input

export const onMenuOpen = actionDisp(Actions.MENU_OPEN)

// create

export const onInputChange = actionDisp(Actions.INPUT_CHANGE)
export const onCancel = actionDisp(Actions.CANCEL)
export const onSave = actionDisp(Actions.SAVE)
export const onStackCreate = actionDisp(Actions.STACK_CREATE)
export const onDetailCreate = actionDisp(Actions.DETAIL_CREATE)
export const onIndexCreate = actionDisp(Actions.INDEX_CREATE)
export const onBreadcrumbClick = actionDisp(Actions.BREADCRUMB_CLICK)

// tooltip

export const onTooltipOpen = actionDisp(Actions.TOOLTIP_OPEN)
