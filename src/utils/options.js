import * as R from 'ramda'

export const initState = {}

export const filterSelectOptions = ({
  state,
  modelName,
  fieldName,
  condition
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

export const selectOptions = state => R.path(['conveyor', 'options'], state)
export const getOptions = (state, modelName, fieldName) =>
  R.pathOr([], ['conveyor', 'options', modelName, fieldName], state)
