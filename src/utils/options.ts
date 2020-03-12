import * as R from 'ramda'

export const initState = {}

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

export const selectOptions = (state: any) =>
  R.path(['conveyor', 'options'], state)
export const getOptions = (state: any, modelName: string, fieldName: string) =>
  R.pathOr([], ['conveyor', 'options', modelName, fieldName], state)
