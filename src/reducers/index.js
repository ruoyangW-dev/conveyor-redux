import * as R from 'ramda'
import { combineReducers } from 'redux'
import { AlertsReducer } from './alerts'
import { CreateReducer } from './create'
import { EditReducer } from './edit'
import { ModalReducer } from './modal'
import { ModelReducer } from './model'
import { OptionsReducer } from './options'
import { TooltipReducer } from './tooltip'
import { TableViewReducer } from './tableView'
import { SearchReducer } from './search'

const conveyorReducerMap = {
  alerts: AlertsReducer,
  create: CreateReducer,
  edit: EditReducer,
  modal: ModalReducer,
  model: ModelReducer,
  options: OptionsReducer,
  tooltip: TooltipReducer,
  tableView: TableViewReducer,
  search: SearchReducer
}
import { SchemaBuilder } from '@autoinvent/conveyor-schema'

export class ConveyorReducer {
  constructor(schema, overrides) {

    // this is temporary. take away once class guaranteed to
    // receive the schema prop as a 'SchemaBuilder' type, not JSON type
    // once done, can uninstall conveyor-schema from package.json
    if (!('schemaJSON' in schema)) {
      schema = new SchemaBuilder(schema)
    }

    const mergedReducerMap = R.filter(
      R.identity,
      R.mergeRight(conveyorReducerMap, overrides)
    )
    R.forEachObjIndexed((Reducer, key) => {
      this[key] = new Reducer(schema)
    }, mergedReducerMap)
  }

  makeReducer() {
    return combineReducers(
      R.map(Reducer => (state, action) => Reducer.reduce(state, action), this)
    )
  }
}
