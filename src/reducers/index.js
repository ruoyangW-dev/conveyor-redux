import { generateAlertReducer } from './alerts'
import { generateCreateReducer } from './create'
import { generateEditReducer } from './edit'
import { generateModalReducer } from './modal'
import { generateModelReducer } from './model'
import { generateOptionsReducer } from './options'
import { generateTooltipReducer } from './tooltip'
import { generateTableViewReducer } from './tableView'
import { generateSearchReducer } from './search'
import * as R from 'ramda'

const generateReducerMap = {
  alerts: generateAlertReducer,
  create: generateCreateReducer,
  edit: generateEditReducer,
  modal: generateModalReducer,
  model: generateModelReducer,
  options: generateOptionsReducer,
  tooltip: generateTooltipReducer,
  tableView: generateTableViewReducer,
  search: generateSearchReducer
}

const validateCustomReducer = (customReducer, key) => {
  return R.filter(
    R.identity,
    R.mapObjIndexed((actionFunc, action) => {
      if (R.type(actionFunc) === 'Function') {
        return actionFunc
      } else {
        console.warn(
          `WARNING: Non-function type supplied for custom action (${action}) in reducer (${key}) --- IGNORING!`
        )
        return undefined
      }
    }, customReducer)
  )
}

export const generateConveyorReducers = ({ schema, customReducers = {} }) => {
  return R.filter(
    R.identity,
    R.mapObjIndexed((generateReducer, key) => {
      if (customReducers[key] === false) {
        return undefined
      }
      console.log(key, validateCustomReducer(customReducers[key], key))
      return generateReducer({ schema, customActions: validateCustomReducer(customReducers[key], key) })
    }, generateReducerMap)
  )
}
