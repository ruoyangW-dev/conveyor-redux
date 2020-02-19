import {
  getField,
  getFields,
  getFieldLabel,
  inputTypes,
  getType,
  isRel,
  storeValueToArrayBuffer
} from 'conveyor'
import * as R from 'ramda'
import * as consts from '../actionConsts'
import * as Logger from './Logger'

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
          inputType === inputTypes.ONE_TO_ONE_TYPE ||
          inputType === inputTypes.MANY_TO_ONE_TYPE
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

export const editFieldToQueryInput = ({
  schema,
  modelName,
  fieldName,
  value,
  type
}) => {
  if (type === undefined) {
    type = getType({ schema, modelName, fieldName })
  }
  if (fieldName === '__typename') {
    return
  }
  if (type.includes('ToMany')) {
    if (R.isNil(value)) {
      return []
    }
    return value.map(value => R.prop('value', value))
  } else if (type.includes('ToOne')) {
    return R.propOr(null, 'value', value)
  } else if (type === 'enum') {
    return R.propOr(null, 'value', value)
  } else if (type === 'file') {
    if (R.isNil(value)) {
      return value
    }
    return storeValueToArrayBuffer(value)
  } else if (type === 'boolean') {
    return typeof value === typeof false ? value : false
  }
  return value
}

export const isValidationError = response => R.prop('status', response) === 200

const errorMap = ({ schema, type, fields, modelName }) => {
  let fieldNames = []
  R.forEach(field => {
    fieldNames = R.append(
      getFieldLabel({ schema, modelName, fieldName: field }),
      fieldNames
    )
  }, fields)

  switch (type) {
    case consts.UNIQUE_CONSTRAINT: {
      const len = fieldNames.length
      let extra = ''
      if (len > 1) {
        extra = `combination of ${fieldNames
          .slice(0, fieldNames.length - 1)
          .join(', ')} and `
      }
      const last = fieldNames[fieldNames.length - 1]
      return `This ${extra}${last} already exists.`
    }
    case consts.INCORRECT_DATA_SOURCE_SYSTEM_TYPE:
      return 'Source and Destination must be on the same System.'
    case consts.INCORRECT_REQUIREMENT_PARENT_TYPE:
      return 'Cannot add this Requirement as a Parent (incompatible type).'
    case consts.INCORRECT_REQUIREMENT_JMET_TYPE:
      return 'Cannot add JMET to Requirement with type "Business".'
    default:
      return null
  }
}

const getValidationMessage = ({ schema, context, parsedErrors }) =>
  R.mapObjIndexed((fieldErrors, key) => {
    let errorsList = []
    R.forEach(e => {
      const message = errorMap({
        type: R.prop('type', e),
        fieldName: key,
        fields: R.prop('group', e),
        modelName: R.prop('modelName', context),
        schema
      })
      if (message) {
        errorsList = R.append(message, errorsList)
      }
    }, fieldErrors)
    return errorsList
  }, parsedErrors)

const parseValidationErrors = response => {
  const errorsStr = R.path(['errors', 0, 'message'], response)
  let errors = []
  try {
    errors = JSON.parse(errorsStr)
  } catch (e) {
    Logger.inputValidationParseValidationErrors(response, e)
  }
  return errors
}

export const prepValidationErrors = ({ schema, context, error }) => {
  const parsedErrors = parseValidationErrors(error.response)
  return getValidationMessage({ schema, context, parsedErrors })
}

export const getEditMutationInputVariables = ({ schema, modelName, node }) =>
  R.pipe(
    R.mapObjIndexed((value, fieldName) =>
      editFieldToQueryInput({ schema, modelName, fieldName, value })
    ),
    R.dissoc('__typename'),
    R.dissoc('id')
  )(node)

export const getDeleteErrors = ({ data, context }) =>
  R.path(['delete' + context.modelName, 'errors'], data)

const getInputValue = (fieldName, formStack) => {
  const index = R.prop('index', formStack)
  return R.path(['stack', index, 'fields', fieldName], formStack)
}

// get input values from a create form
export const getCreateSubmitValues = ({ schema, formStack, modelName }) => {
  const createFields = R.filter(
    field => R.propOr(true, 'showCreate', field),
    getFields(schema, modelName)
  )
  const formStackIndex = R.prop('index', formStack)
  const origin = R.prop('originModelName', formStack)
  if (origin && formStackIndex === 0) {
    const originFieldName = R.prop('originFieldName', formStack)
    createFields[originFieldName] = originFieldName
  }

  const inputs = Object.assign(
    {},
    ...Object.entries(createFields).map(([fieldName]) => ({
      [fieldName]: editFieldToQueryInput({
        schema,
        modelName,
        fieldName,
        value: getInputValue(fieldName, formStack)
      })
    }))
  )
  return R.pickBy((_, fieldName) => {
    // Ignore fields who have submitCreate as false,
    // defaults to true
    return R.propOr(
      true,
      'submitCreate',
      getField(schema, modelName, fieldName)
    )
  }, inputs)
}

export const fileSubmitToBlob = ({ payload, query, value }) => {
  const formData = new FormData()
  const modelName = R.prop('modelName', payload)
  const fieldName = R.prop('fieldName', payload)
  const id = R.prop('id', payload)
  const fileData = R.propOr(false, 'fileData', payload)

  let variableInputDict
  let fileInputDict

  if (fileData) {
    variableInputDict = R.map(
      () => consts.CREATE_FILE,
      fileData
    )
    fileInputDict = fileData
  } else if (value) {
    variableInputDict = { [fieldName]: consts.CREATE_FILE }
    // type needed => reconciliation is not in schema
    const arrayBuffer = editFieldToQueryInput({
      modelName,
      fieldName,
      value,
      type: inputTypes.FILE_TYPE
    })
    fileInputDict = { [fieldName]: arrayBuffer }
  }
  if (query) {
    formData.append('query', query)
  }
  const variables = JSON.stringify({
    id,
    input: variableInputDict
  })
  formData.append('variables', variables)

  for (const [fieldName, contents] of Object.entries(fileInputDict)) {
    formData.append(
      fieldName,
      new Blob([contents], { type: 'application/octet-stream' }),
      fieldName
    )
  }
  return formData
}
