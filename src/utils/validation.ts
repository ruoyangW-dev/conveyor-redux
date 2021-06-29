import * as R from 'ramda'

export const makeErrorsFromMissingFields = (missingFields: any) => {
  return R.reduce(
    (acc: any, fieldName: any) => {
      return R.assoc(fieldName, fieldName + ' is required', acc)
    },
    {} as any,
    missingFields
  )
}
