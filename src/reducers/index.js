import { generateCreateReducer } from './create'
import { generateEditReducer } from './edit'
import { generateLoggerReducer } from './logger'
import { generateModalReducer } from './modal'
import { generateModelReducer } from './model'
import { generateOptionsReducer } from './options'
import { generateTooltipReducer } from './tooltip'
import { generateTableViewReducer } from './tableView'

export const generateConveyorReducers = schema => {
  const create = generateCreateReducer(schema)
  const edit = generateEditReducer(schema)
  const logger = generateLoggerReducer(schema)
  const modal = generateModalReducer(schema)
  const model = generateModelReducer(schema)
  const options = generateOptionsReducer(schema)
  const tooltip = generateTooltipReducer(schema)
  const tableView = generateTableViewReducer(schema)

  return {
    create,
    edit,
    logger,
    modal,
    model,
    options,
    tooltip,
    tableView
  }
}
