import * as R from 'ramda'
import * as Actions from '../actionConsts'
import { getDisplayValue, getField, getTooltipFields } from 'conveyor'

const initState = []

export const isManyToOne = field => {
  return R.pathOr(false, ['type', 'type'], field) === 'ManyToOne'
}

export const isOneToMany = field => {
  return R.pathOr(false, ['type', 'type'], field) === 'OneToMany'
}

export const generateTooltipReducer = schema => (state = initState, action) => {
  const payload = R.prop('payload', action)
  switch (action.type) {
    case Actions.TOOLTIP_OPEN: {
      const id = R.prop('id', payload)
      const modelName = R.prop('modelName', payload)
      const rawData = R.prop('rawData', payload)

      // example of what tooltip data would look like
      // modelName => [list of id's] => [list object attributes]
      const tooltipData = []

      // get fields that should appear in tooltip
      // >>> ["name", "description"]
      const showTooltipFields = getTooltipFields(schema, modelName)

      R.mapObjIndexed((value, name) => {
        const field = getField(schema, modelName, name)
        if (R.contains(name, showTooltipFields)) {
          // add values to 'tooltipData' in this format:
          // { name: <fieldName>, value: [{value}, ... ] }
          if (value === null) {
            tooltipData.push({
              name,
              value: [
                {
                  text: 'N/A'
                }
              ]
            })
          } else if (isOneToMany(field)) {
            const relModelName = R.path(['type', 'target'], field)
            const values = value.map(node => {
              const text = getDisplayValue({
                schema,
                modelName: relModelName,
                node
              })
              return {
                text,
                url: `/${relModelName}/${R.prop('id', node)}`
              }
            })
            tooltipData.push({
              name,
              value: values
            })
          } else if (isManyToOne(field)) {
            const relModelName = R.path(['type', 'target'], field)
            const text = getDisplayValue({
              schema,
              modelName: relModelName,
              node: value
            })
            tooltipData.push({
              name,
              value: [
                {
                  text,
                  url: `/${relModelName}/${R.prop('id', value)}`
                }
              ]
            })
          } else {
            tooltipData.push({
              name,
              value: [
                {
                  text: value
                }
              ]
            })
          }
        }
      }, rawData)
      return R.assocPath([modelName, id.toString()], tooltipData, state)
    }

    default:
      return state
  }
}

export const selectTooltip = R.propOr(initState, 'tooltip')
