import { generateCreateReducer } from './create'
import { generateEditReducer } from './edit'
import { generateModalReducer } from './modal'
import { generateOptionsReducer } from './options'
import { generateTooltipReducer } from './tooltip'

export const generateConveyorReducers = schema => {
  const create = generateCreateReducer(schema)
  const edit = generateEditReducer(schema)
  const modal = generateModalReducer(schema)
  const options = generateOptionsReducer(schema)
  const tooltip = generateTooltipReducer(schema)

  return { create, edit, modal, options, tooltip }
}
