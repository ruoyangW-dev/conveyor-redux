import * as R from 'ramda'

export const initState = {}

/**
 * Filters options by a given condition
 * @param state Redux state
 * @param modelName Model name
 * @param fieldName Field name
 * @param condition The condition that the options will filter by
 * @returns Filtered options
 */
export const filterSelectOptions = ({
  state,
  modelName,
  fieldName,
  condition
}: {
  state: any
  modelName: string
  fieldName: string
  condition: any
}) => {
  const relPath = ['conveyor', 'options', modelName, fieldName]

  if (R.path(relPath, state)) {
    state = R.assocPath(
      relPath,
      R.filter(condition, R.pathOr([], relPath, state)),
      state
    )
  }
  return selectOptions(state)
}

/**
 * Returns value of conveyor.options from state
 * @param state Redux state
 * @returns Value of state.conveyor.options
 */
export const selectOptions = (state: any) =>
  R.path(['conveyor', 'options'], state)

  /**
   * Gets options for a given field
   * @param state Redux state
   * @param modelName Name of model
   * @param fieldName Name of field
   * @returns conveyor.options.modelName.fieldName from state
   */
export const getOptions = (state: any, modelName: string, fieldName: string) =>
  R.pathOr([], ['conveyor', 'options', modelName, fieldName], state)
