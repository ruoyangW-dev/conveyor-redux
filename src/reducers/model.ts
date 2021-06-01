import * as R from 'ramda'
import {
  UPDATE_MODEL_INDEX,
  UPDATE_MODEL_DETAIL,
  UPDATE_DELETE_MODEL,
  REMOVE_INSTANCE,
  MODEL_NOT_FOUND
} from '../actionConsts'
import { initState, updateIndex, getDefaultModelStore } from '../utils/model'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import { Config } from '../types'

/**
 * A class containing reducers handling model actions
 */
export class ModelReducer extends Reducer {
  /**
   * Creates a reducer object that can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   * @param config Custom user inputted configurations
   */
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }

  /**
   * Dispatched when a model can not be found.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string}}
   * @returns Sets value of conveyor.model.modelName to null in state
   */
  [MODEL_NOT_FOUND](state: any, action: any) {
    const modelName = R.path(['payload', 'modelName'], action) as string
    return { ...state, [modelName]: null }
  }

  /**
   * Called when loading a model's Index. \
   * Called by [fetchModelIndex](./modelepic.html#fetch_model_index) and 
   * [relationshipSelectMenuOpen](./optionsepic.html#relationship_select_menu_open)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, data: object}}
   * @returns Adds/Updates conveyor.model.modelName to state
   */
  [UPDATE_MODEL_INDEX](state: any, action: any) {
    const modelName = R.path(['payload', 'modelName'], action) as string
    // @ts-ignore
    const data = R.path(['payload', 'data', 'result'], action)
    return updateIndex(state, modelName, data)
  }

  /**
   * Called by [fetchModelDetail](./modelepic.html#fetch_model_detail)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, id: string, data: object}}
   * @returns Adds/Updates object {order: [nodeId], values: {nodeId: {fields}}} to conveyor.model.modelName in state
   */
  [UPDATE_MODEL_DETAIL](state: any, action: any) {
    const modelName = R.path(['payload', 'modelName'], action) as string
    // @ts-ignore
    const id = R.path(['payload', 'id'], action) as string
    const store = {
      ...(R.propOr(getDefaultModelStore(), modelName, state) as object)
    } as any
    const oldNode = R.prop(id, store.values)
    const newNode = R.path(['payload', 'data', 'result'], action)

    if (!oldNode) {
      store.order.push(id)
    }
    store.values[id] = newNode

    return { ...state, [modelName]: store }
  }

  /**
   * Dispatched by [requestDeleteModel](./modelepic.html#request_delete_model)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, id: string}}
   * @returns Sets value of object {order, value} from conveyor.model.modelName to null in state
   */
  [UPDATE_DELETE_MODEL](state: any, action: any) {
    const modelName = R.path(['payload', 'modelName'], action) as string
    const id = R.path(['payload', 'id'], action) as string
    const store = {
      ...(R.propOr(getDefaultModelStore(), modelName, state) as object)
    } as any
    store.values = R.dissoc(id, store.values)
    store.order = R.without([id], store.order)
    return { ...state, [modelName]: store }
  }

  /**
   * Dispatched by [requestDeleteModelFromDetailPage](./modelepic.html#request_delete_model_from_detail_page)
   * @param state Redux state
   * @param action object {type: string, payload: {id: string, modelName: string}}
   * @returns Sets value of conveyor.model.modelName.values.id.result to null in state
   */
  [REMOVE_INSTANCE](state: any, action: any) {
    const modelName = R.path(['payload', 'modelName'], action) as string
    const id = R.path(['payload', 'id'], action) as string
    return R.assocPath(
      [modelName, 'values', id.toString()],
      { result: null },
      state
    )
  }
}
