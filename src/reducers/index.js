import { generateAlertReducer } from './alerts'
import { generateCreateReducer } from './create'
import { generateEditReducer } from './edit'
import { generateModalReducer } from './modal'
import { generateModelReducer } from './model'
import { generateOptionsReducer } from './options'
import { generateTooltipReducer } from './tooltip'
import { generateTableViewReducer } from './tableView'
import { generateSearchReducer } from './search'

export const generateConveyorReducers = schema => {
  const alerts = generateAlertReducer(schema)
  const create = generateCreateReducer(schema)
  const edit = generateEditReducer(schema)
  const modal = generateModalReducer(schema)
  const model = generateModelReducer(schema)
  const options = generateOptionsReducer(schema)
  const tooltip = generateTooltipReducer(schema)
  const tableView = generateTableViewReducer(schema)
  const search = generateSearchReducer(schema)

  return {
    alerts,
    create,
    edit,
    modal,
    model,
    options,
    search,
    tooltip,
    tableView
  }
}
