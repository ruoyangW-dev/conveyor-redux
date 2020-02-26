import * as R from 'ramda'
import * as Actions from '../actionConsts'
import {
  getDisplayValue,
  getField,
  getTooltipFields,
  getFieldLabel,
  getType,
  getEnumLabel,
  isManyToMany
} from 'conveyor'

export const initState = []

export const isManyToOne = field => {
  return R.pathOr(false, ['type', 'type'], field) === 'ManyToOne'
}

export const isOneToMany = field => {
  return R.pathOr(false, ['type', 'type'], field) === 'OneToMany'
}

export const generateTooltipReducer = ({ schema, customActions = {} }) => (
  state = initState,
  action
) => {
  if (R.has(action.type, customActions)) {
    return customActions[action.type](state)
  }

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
    case Actions.UPDATE_MODEL_TOOLTIP: {
      const id = R.prop('id', payload)
      const modelName = R.prop('modelName', payload)
      const result = R.path(['data', 'result'], payload)
      const tooltipData = []

      for (const fieldName in result) {
        const value = R.prop(fieldName, result)
        const name = getFieldLabel({ schema, modelName, fieldName })
        const type = getType({ schema, modelName, fieldName })
        const field = getField(schema, modelName, fieldName)

        if (value === null) {
          tooltipData.push({
            name,
            value: [
              {
                text: 'N/A'
              }
            ]
          })
        } else if (type === 'enum') {
          tooltipData.push({
            name,
            value: [
              {
                text: getEnumLabel({ schema, modelName, fieldName, value })
              }
            ]
          })
        } else if (isManyToMany(field)) {
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
          const relModelName = R.path(
            ['type', 'target'],
            getField(schema, modelName, fieldName)
          )
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

      return R.assocPath([modelName, id.toString()], tooltipData, state)
    }

    default:
      return state
  }
}

export const selectTooltip = R.propOr(initState, 'tooltip')
