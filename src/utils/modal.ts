import * as R from 'ramda'

export const initState = {}

export const groupModels = (collection: any, property: any) => {
  const values = []
  const result = []
  for (let i = 0; i < collection.length; i++) {
    const val = collection[i][property]
    const index = values.indexOf(val)
    if (index > -1) {
      result[index].push(collection[i])
    } else {
      values.push(val)
      result.push([collection[i]])
    }
  }
  return result
}

export const selectModal = (state: any) => R.path(['conveyor', 'modal'], state)
export const selectModalStore = (state: any, modal: any) =>
  R.path(['conveyor', 'modal', modal], state)
