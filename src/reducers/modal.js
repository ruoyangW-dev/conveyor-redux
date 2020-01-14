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
  const payload = action.payload
  switch (action.type) {
    case Actions.INDEX_DELETE: {
      const { modelName, id } = { ...payload }
      // use modelName and id to delete model
      console.log('DELETE INDEX', modelName, id)
      return state
    }
    case Actions.DETAIL_DELETE: {
      const { modelName, id } = { ...payload }
      // use modelName and id to delete model
      console.log('DELETE DETAIL', modelName, id)
      return state
    }
    case Actions.DETAIL_DELETE_FROM_DETAIL_PAGE: {
      const { modelName, id } = { ...payload }
      // use modelName and id to delete model
      console.log('DELETE SELF', modelName, id)
      return state
    }
    case Actions.DELETE_WARNING: {
      const { modelName, id, rawDataList } = { ...payload }
      // fetch models that will be deleted if model is deleted
      console.log('DELETE WARNING', modelName, id)

      // note: raw data must have '__typename' in delete query. otherwise
      // delete warning table will not display correctly

      // group data into an array of arrays. each sub- array
      // holds model objects with name, __typename, & id attributes
      const groupedData = groupModels(rawDataList, '__typename')

      // add to store
      return { ...state, Delete: groupedData }
    }
    case Actions.CANCEL_DELETE: {
      // delete warning data from store
      return { ...state, Delete: [] }
    }
    default:
      return state
  }
}

export const selectModal = state => R.prop('modal', state)
