import { bindActionCreators } from 'redux'
import * as Actions from '../actions'

export const getActions = (dispatch: any) => ({
  actions: {
    delete: {
      onIndexDelete: bindActionCreators(Actions.requestDeleteModel, dispatch),
      onDetailDelete: bindActionCreators(
        Actions.requestDeleteRelTableModel,
        dispatch
      ),
      onDetailDeleteFromDetailPage: bindActionCreators(
        Actions.requestDeleteModelFromDetailPage,
        dispatch
      ),
      onDeleteWarning: bindActionCreators(Actions.fetchDeleteDetail, dispatch),
      onCancelDelete: bindActionCreators(Actions.cancelDeleteDetail, dispatch),
      onFileDelete: bindActionCreators(Actions.onInlineFileDelete, dispatch)
    },
    edit: {
      onTableRowEdit: bindActionCreators(Actions.onTableRowEdit, dispatch),
      onAttributeEdit: bindActionCreators(Actions.onAttributeEdit, dispatch),
      onTableEditCancel: bindActionCreators(
        Actions.onTableEditCancel,
        dispatch
      ),
      onAttributeEditCancel: bindActionCreators(
        Actions.onAttributeEditCancel,
        dispatch
      ),
      onIndexEditSubmit: bindActionCreators(
        Actions.indexEditSubmitCheck,
        dispatch
      ),
      onDetailTableEditSubmit: bindActionCreators(
        Actions.detailTableEditSubmitCheck,
        dispatch
      ),
      onDetailAttributeSubmit: bindActionCreators(
        Actions.detailAttributeEditSubmitCheck,
        dispatch
      ),
      onEditInputChange: bindActionCreators(
        Actions.onEditInputChange,
        dispatch
      ),
      onFileSubmit: bindActionCreators(Actions.onInlineFileSubmit, dispatch),
      onDetailTableRemoveSubmit: bindActionCreators(
        Actions.onDetailTableRemoveSubmit,
        dispatch
      )
    },
    input: {
      onMenuOpen: bindActionCreators(
        Actions.relationshipSelectMenuOpen,
        dispatch
      ),
      onCreatableMenuOpen: bindActionCreators(
        Actions.querySelectMenuOpen,
        dispatch
      )
    },
    create: {
      onInputChange: bindActionCreators(Actions.onCreateInputChange, dispatch),
      onCancel: bindActionCreators(Actions.onCancelCreate, dispatch),
      onSave: bindActionCreators(Actions.saveCreateCheck, dispatch),
      onStackCreate: bindActionCreators(Actions.onStackCreate, dispatch),
      onDetailCreate: bindActionCreators(Actions.onDetailCreate, dispatch),
      onIndexCreate: bindActionCreators(Actions.onIndexCreate, dispatch),
      onBreadcrumbClick: bindActionCreators(
        Actions.onUpdateFormStackIndex,
        dispatch
      )
    },
    tooltip: {
      onTooltipOpen: bindActionCreators(Actions.fetchModelTooltip, dispatch)
    },
    tableOptions: {
      sort: bindActionCreators(Actions.indexTableSortChange, dispatch),
      addFilter: bindActionCreators(Actions.indexAddFilter, dispatch),
      deleteFilter: bindActionCreators(Actions.indexDeleteFilter, dispatch),
      clearFilters: bindActionCreators(Actions.indexClearFilters, dispatch),
      changeField: bindActionCreators(Actions.indexChangeFilterField, dispatch),
      filterChange: bindActionCreators(
        Actions.indexTableFilterChange,
        dispatch
      ),
      filterSubmit: bindActionCreators(
        Actions.indexTableFilterSubmit,
        dispatch
      ),
      filterDropdown: bindActionCreators(
        Actions.indexTableFilterDropdown,
        dispatch
      ),
      collapseTableChange: bindActionCreators(
        Actions.collapseTableChange,
        dispatch
      ),
      changePage: bindActionCreators(Actions.changePage, dispatch),
      changeRelTablePage: bindActionCreators(
        Actions.changeRelTablePage,
        dispatch
      ),
      changeGotoPage: bindActionCreators(Actions.changeGotoPage, dispatch),
      changeRelGotoPage: bindActionCreators(Actions.changeRelGotoPage, dispatch)
    }
  }
})
