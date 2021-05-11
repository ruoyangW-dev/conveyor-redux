** Documentation Outline **
===========================

Note: Let users know somewhere that 'customProps' won't be received by reducers (Per issue #18).

Description
----------------------
In README

Special Features
----------------------
ex) pagination, sorting, filtering, etc.

Setup
----------------------
In README

Redux Structure
----------------------

Redux Override Guide
----------------------
In README

Actions
----------------------

delete

- updateDeleteDetail
    | constant: UPDATE_DELETE_DETAIL
    | epic: N/A (Remove)
    | reducer: "Some State"
- cancelDeleteDetail
    | constant: CANCEL_DELETE_DETAIL
    | reducer: 
- fetchDeleteDetail 
    | constant: 
    | epic: 
    | reducer: 

edit

- onTableRowEdit
    | constant: 
    | epic: 
    | reducer: 
- onAttributeEdit
    | constant: 
    | epic: 
    | reducer: 
- onTableEditCancel
    | constant: 
    | epic: 
    | reducer: 
- onAttributeEditCancel
    | constant: 
    | epic: 
    | reducer: 
- onIndexEditSubmit
    | constant: 
    | epic: 
    | reducer: 
- onDetailTableEditSubmit
    | constant: 
    | epic: 
    | reducer: 
- onDetailAttributeEditSubmit
    | constant: 
    | epic: 
    | reducer: 
- onEditInputChange
    | constant: 
    | epic: 
    | reducer: 
- onInlineFileSubmit
    | constant: 
    | epic: 
    | reducer: 
- onInlineFileDelete
    | constant: 
    | epic: 
    | reducer: 
- onValidationErrorEdit
    | constant: 
    | epic: 
    | reducer: 
- onValidationErrorTableRow
    | constant: 
    | epic: 
    | reducer: 
- onDetailTableRemoveSubmit
    | constant: 
    | epic: 
    | reducer: 

input

- onMenuOpen
    | constant: 
    | epic: 
    | reducer: 

create

- onCreateInputChange
    | constant: 
    | epic: 
    | reducer: 
- onCancelCreate
    | constant: 
    | epic: 
    | reducer: 
- onSaveCreate
    | constant: 
    | epic: 
    | reducer: 
- onSaveCreateSuccessful
    | constant: 
    | epic: 
    | reducer: 
- onStackCreate
    | constant: 
    | epic: 
    | reducer: 
- onDetailCreate
    | constant: 
    | epic: 
    | reducer: 
- onIndexCreate
    | constant: 
    | epic: 
    | reducer: 
- onUpdateFormStackIndex
    | constant: 
    | epic: 
    | reducer: 
- onValidationErrorCreate
    | constant: 
    | epic: 
    | reducer: 

tooltip

- fetchModelTooltip
    | constant: 
    | epic: 
    | reducer: 
- updateModelTooltip
    | constant: 
    | epic: 
    | reducer: 

tableView

- changePage
    | constant: 
    | epic: 
    | reducer: 
- collapseTableChange
    | constant: 
    | epic: 
    | reducer: 
- indexAddFilter
    | constant: 
    | epic: 
    | reducer: 
- indexClearFilters
    | constant: 
    | epic: 
    | reducer: 
- indexChangeFilterField
    | constant: 
    | epic: 
    | reducer: 
- indexDeleteFilter
    | constant: 
    | epic: 
    | reducer: 
- indexTableFilterChange
    | constant: 
    | epic: 
    | reducer: 
- indexTableFilterSubmit
    | constant: 
    | epic: 
    | reducer: 
- indexTableFilterDropdown
    | constant: 
    | epic: 
    | reducer: 
- indexTableSortChange
    | constant: 
    | epic: 
    | reducer: 
- changeRelTablePage
    | constant: 
    | epic: 
    | reducer: 
- changeGotoPage
    | constant: 
    | epic: 
    | reducer: 
- changeRelGotoPage
    | constant: 
    | epic: 
    | reducer: 

model

- fetchModelDetail
    | constant: 
    | epic: 
    | reducer: 
- fetchModelIndex
    | constant: 
    | epic: 
    | reducer: 
- updateModelDetail
    | constant: 
    | epic: 
    | reducer: 
- updateModelIndex
    | constant: 
    | epic: 
    | reducer: 
- modelNotFound
    | constant: 
    | epic: 
    | reducer: 
- requestDeleteModel
    | constant: 
    | epic: 
    | reducer: 
- updateDeleteModel
    | constant: 
    | epic: 
    | reducer: 
- requestDeleteRelTableModel
    | constant: 
    | epic: 
    | reducer: 
- requestDeleteModelFromDetailPage
    | constant: 
    | epic: 
    | reducer: 
- removeInstance
    | constant: 
    | epic: 
    | reducer: 

search

- fetchSearchEntries
    | constant: 
    | epic: 
    | reducer: 
- searchQueryTextChange
    | constant: 
    | epic: 
    | reducer: 
- searchQueryLinkClicked
    | constant: 
    | epic: 
    | reducer: 
- updateSearchEntries
    | constant: 
    | epic: 
    | reducer: 
- onSearchBlur
    | constant: 
    | epic: 
    | reducer: 
- onTriggerSearch
    | constant: 
    | epic: 
    | reducer: 

options

- dataOptionsUpdate
    | constant: 
    | epic: 
    | reducer: 
- existingValueUpdate
    | constant: 
    | epic: 
    | reducer: 
- querySelectMenuOpen
    | constant: 
    | epic: 
    | reducer: 
- relationshipSelectMenuOpen
    | constant: 
    | epic: 
    | reducer: 

alerts

- addDangerAlert
    | constant: 
    | epic: 
    | reducer: 
- addSuccessAlert
    | constant: 
    | epic: 
    | reducer: 
- addAlert
    | constant: 
    | epic: 
    | reducer: 
- dismissAlert
    | constant: 
    | epic: 
    | reducer: 

validation

- saveCreateCheck
    | constant: 
    | epic: 
    | reducer: 
- detailAttributeEditSubmitCheck
    | constant: 
    | epic: 
    | reducer: 
- detailTableEditSubmitCheck
    | constant: 
    | epic: 
    | reducer: 
- indexEditSubmitCheck
    | constant: 
    | epic: 
    | reducer: 

----------------------------

utils
----------------------

alert

- handleError: 

create

- handleStackPop
- handleStackPush
- clearFormStack
- handleEnterFormStack
- handleDetailCreate
- handleCreateInputChange
- handleValidationErrorCreate
- handleClearErrorSave
- selectCreate

edit

- getEditValue
- selectEdit

getActions

helper

- storeValueToArrayBuffer
- getFilters
- getSort
- getPage
- editFieldToQueryInput
- isValidationError
- errorMap
- getValidationMessage
- parseValidationErrors
- prepValidationErrors
- getEditMutationInputVariables
- getDeleteErrors
- getCreateSubmitValues
- fileSubmitToBlob
- isModelPathPrefix
- modelIndexPath
- modelDetailPath
- modelCreatePath
- pathFunctions
- getPath
- tableChangedFields
- getMissingFieldsMessage

Logger

- isEnabled
- enable
- log
- epicError
- rootEpicError
- inputValidationParseValidationErrors

mergeAction

- mergeConveyorActions

modal

- groupModels
- selectModal
- selectModalStore

model

- slicePageData
- getModelStore
- getPaginatedNode
- getTabIdentifier
- getDefaultModelStore
- getOrderedValues
- updateIndex
- selectModel
- getDetailUrl
- getIndexUrl

options

- filterSelectOptions
- selectOptions
- getOptions

search

- selectSearch
- selectSearchDropdown
- selectSearchEntries
- selectSearchQueryText

tableView

- removeAll
- setValues
- selectTableView

tooltip

- selectTooltip

----------------------------

Query Types
-----------

- index
- detail
- select
- tooltip
- indexRelationship
- detailRelationship
- selectRelationship
- search
- create
- update
- delete
- deleteCascades
- selectExistingFields
