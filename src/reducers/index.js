import { generateCreateReducer } from './create'
import { generateEditReducer } from './edit'
import { generateModalReducer } from './modal'
import { generateOptionsReducer } from './options'
import { generateTooltipReducer } from './tooltip'
import { generateTableViewReducer } from './tableView'

export const generateConveyorReducers = schema => {
  const create = generateCreateReducer(schema)
  const edit = generateEditReducer(schema)
  const modal = generateModalReducer(schema)
  const options = generateOptionsReducer(schema)
  const tooltip = generateTooltipReducer(schema)
  const tableView = generateTableViewReducer(schema)

  return { create, edit, modal, options, tooltip, tableView }
}
