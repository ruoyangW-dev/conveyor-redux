import * as R from 'ramda'

export const initState: any = {}

export const selectValidation = R.pathOr(initState, ['conveyor', 'validation'])

export const failedValidation = (state: any) => {
  const validation = selectValidation(state)
  return function (modelName: string, fieldName: string) {
    if (
      !R.propEq('modelName', modelName, validation) ||
      !R.has('missingFields', validation)
    ) {
      return false
    }
    return R.includes(
      fieldName,
      R.prop('missingFields', validation) as string[]
    )
  }
}
