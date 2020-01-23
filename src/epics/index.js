import { combineEpics } from 'redux-observable'
import {
  generateIndexTableFilterChangeEpic,
  generateIndexTableSortChangeEpic
} from './indexTable'
import {
  generateFetchModelIndexEpic,
  generateFetchModelDetailEpic
} from './model'
import { generateRouteEpic } from './route'
import { generateTooltipEpic } from './tooltip'

export const generateConveyorEpics = (schema, doRequest) => {
  const fetchModelIndexEpic = generateFetchModelIndexEpic(schema, doRequest)
  const fetchModelDetailEpic = generateFetchModelDetailEpic(schema, doRequest)
  const indexFilterEpic = generateIndexTableFilterChangeEpic(schema, doRequest)
  const indexSortEpic = generateIndexTableSortChangeEpic(schema, doRequest)
  const routeEpic = generateRouteEpic(schema, doRequest)
  const tooltipEpic = generateTooltipEpic(schema, doRequest)

  return {
    fetchModelIndexEpic,
    fetchModelDetailEpic,
    indexFilterEpic,
    indexSortEpic,
    routeEpic,
    tooltipEpic
  }
}

