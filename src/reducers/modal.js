import * as R from 'ramda'
import * as Actions from '../actionConsts'

const initState = {}

const groupModels = (collection, property) => {
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

export const generateModalReducer = () => (state = initState, action) => {
  switch (action.type) {
    case Actions.UPDATE_DELETE_DETAIL: {
      const deletes = R.path(['payload', 'data', 'checkDelete'], action)
      const groupedData = groupModels(deletes, '__typename')
      return { ...state, Delete: groupedData }
    }
    case Actions.CANCEL_DELETE_DETAIL: {
      return { ...state, Delete: undefined }
    }
    default:
      return state
  }
}

export const selectModal = state => R.prop('modal', state)
export const selectModalStore = (state, modal) =>
  R.path(['modal', modal], state)
