import { getFields, inputTypes, getType, isRel } from 'conveyor'
import * as R from 'ramda'

export const getFilters = ({ schema, modelName, tableView }) => {
  const fields = getFields(schema, modelName)
  const getFieldFilter = field => {
    const fieldName = R.prop('fieldName', field)
    const operator = R.path(
      [modelName, 'filter', 'filterValue', fieldName, 'operator', 'value'],
      tableView
    )
    const value = R.path(
      [modelName, 'filter', 'filterValue', fieldName, 'value'],
      tableView
    )
    if (operator && field.type === inputTypes.BOOLEAN_TYPE) {
      return { operator, value: R.isNil(value) ? false : value }
    }
    if (operator && !R.isNil(value) && !R.isEmpty(value)) {
      if (isRel(field)) {
        const inputType = getType({ schema, modelName, fieldName })
        if (
          inputType ===
          inputTypes.ONE_TO_ONE_TYPE || inputType === inputTypes.MANY_TO_ONE_TYPE
        ) {
          return { operator, value: R.propOr(value, 'value', value) }
        }
        return { operator, value: value.map(val => val.value) }
      }
      if (field.type === inputTypes.ENUM_TYPE) {
        return { operator, value: value.value }
      }
      return { operator, value }
    }
    return undefined
  }
  let filters = R.map(getFieldFilter, fields)
  // filterFields: default filters, in addition filters set by user; always active
  const defaultFilters = R.path([modelName, 'filterFields'], schema)
  if (defaultFilters) {
    filters = R.merge(filters, defaultFilters)
  }
  return R.filter(R.identity, filters)
}

export const getSort = ({ schema, modelName, tableView }) => {
  // get sort from user input
  if (tableView) {
    const sortKey = R.path([modelName, 'sort', 'sortKey'], tableView)
    const fieldName = R.path([modelName, 'sort', 'fieldName'], tableView)
    if (sortKey && fieldName) {
      return [`${fieldName}_${sortKey}`]
    }
  }
  // otherwise, get default sort from schema
  // sortFields: camel-case fields followed by '_asc' or '_desc'.
  return R.path([modelName, 'sortFields'], schema)
}
