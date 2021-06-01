import * as R from 'ramda'
import { initState, getEditValue } from '../utils/edit'
import {
  TABLE_ROW_EDIT,
  ATTRIBUTE_EDIT,
  TABLE_EDIT_CANCEL,
  ATTRIBUTE_EDIT_CANCEL,
  VALIDATION_ERROR_EDIT,
  DETAIL_TABLE_EDIT_SUBMIT,
  DETAIL_ATTRIBUTE_EDIT_SUBMIT,
  EDIT_INPUT_CHANGE,
  VALIDATION_ERROR_TABLE_ROW
} from '../actionConsts'
import { LOCATION_CHANGE } from 'connected-react-router'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Reducer } from './reducer'
import { Config } from '../types'

/**
 * A class containing reducers for Edit actions
 */
export class EditReducer extends Reducer {
  /**
   * Creates a reducer object that can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   * @param config Custom user inputted configurations
   */
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }

  /**
   * Implementation of [connected-react-router](https://github.com/supasate/connected-react-router)'s *LOCATION_CHANGE* 
   * which is dispatched each time the URL is changed.
   * @returns Returns conveyor.edit to its initial state
   */
  [LOCATION_CHANGE]() {
    return initState
  }

  /**
   * Dispatched when editing a table row on the Index page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, node: object, id: string}}
   * @returns Adds the instance's fields with their current and initial values to conveyor.edit.ModelName.nodeId.fields
   */
  [TABLE_ROW_EDIT](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, node } = { ...payload }
    const nodeFlattened = R.mapObjIndexed((value, fieldName) => {
      const editValue = getEditValue({
        schema: this.schema,
        modelName,
        fieldName,
        value
      })
      return {
        currentValue: editValue,
        initialValue: editValue
      }
    }, node)
    // if id is int, assocPath() creates list instead of object
    return R.assocPath([modelName, id.toString()], nodeFlattened, state)
  }

  /**
   * Called when editing an attribute on the Detail page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, id: string, value: any}}
   * @returns Adds/edits object {initialValue: any, currentValue: any} to state conveyor.edit.modelName.nodeId.fieldName
   */
  [ATTRIBUTE_EDIT](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, fieldName, value } = { ...payload }
    const editValue = getEditValue({
      schema: this.schema,
      modelName,
      fieldName,
      value
    })
    const editState = {
      initialValue: editValue,
      currentValue: editValue
    }
    return R.assocPath([modelName, id.toString(), fieldName], editState, state)
  }

  /**
   * Dispatched by [onDetailTableEditSubmit](./editepic.html#detail_table_edit_submit), 
   * [detailTableEditSubmitCheck](./validationepic.html#detail_table_edit_submit_check), 
   * [onIndexEditSubmit](./editepic.html#index_edit_submit#index_edit_submit), and
   * [indexEditSubmitCheck](./validationepic.html#index_edit_submit_check)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, id: string}}
   * @returns Sets value of conveyor.edit.modelName to null when dispatched from either Index or Detail page.
   * 
   */
  [TABLE_EDIT_CANCEL](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id } = { ...payload }
    // todo: make sure works
    const newState = R.dissocPath([modelName, id], state)

    // if no ids on that model are being edited remove the model from the edit store
    if (R.isEmpty(R.prop(modelName, newState))) {
      return R.dissoc(modelName, state)
    }
    return newState
  }

  /**
   * Dispatched by [onDetailAttributeEditSubmit](./editepic.html#detail_attribute_edit_submit), 
   * [onInlineFileSubmit](./editepic.html#inline_file_submit), and
   * [detailAttributeEditSubmitCheck](./validationepic.html#detail_attribute_edit_submit_check)
   * @param state Redux state
   * @param action 
   * @returns Sets value of conveyor.edit.modelName.nodeId.fieldName to null in state
   */
  [ATTRIBUTE_EDIT_CANCEL](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, fieldName, id } = { ...payload }

    // Remove the field from the edit store
    state = R.dissocPath([modelName, id, fieldName], state)

    // if the instance of the model has no fields being edited, remove it from the store
    if (R.isEmpty(R.path([modelName, id], state))) {
      state = R.dissocPath([modelName, id], state)
    }

    // if no instances of the model are being edited, remove the model from the edit store
    if (R.isEmpty(R.prop(modelName, state))) {
      state = R.dissoc(modelName, state)
    }
    return state
  }

  /**
   * Dispatched when a validation error occurs at 
   * [detailAttributeEditSubmitCheck](./validationepic.html#detail_attribute_edit_submit_check)
   * @param state Redux state
   * @param action 
   * @returns Updates conveyor.edit.modelName.id.fieldName.errors with errors
   */
  [VALIDATION_ERROR_EDIT](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, fieldName, errors } = { ...payload }
    R.forEach((fieldNameError) => {
      if (fieldNameError === fieldName) {
        state = R.assocPath(
          [modelName, id.toString(), fieldNameError, 'errors'],
          R.prop(fieldNameError, errors),
          state
        )
      }
    }, Object.keys(errors))
    return state
  }

  /**
   * Dispatched by [detailTableEditSubmitCheck](./validationepic.html#detail_table_edit_submit_check)
   * @param state Redux state
   * @param action object {type: string, payload: {id: string, modelName: string, changedFields: object, parentModelName: string, parentId: string}}
   * @returns Updates conveyor.model.parentModelName.values.parentId.fieldName.id.fieldName with the updated value
   */
  [DETAIL_TABLE_EDIT_SUBMIT](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id } = { ...payload }
    const fields = Object.keys(R.path([modelName, id], state) as any)
    R.forEach((f) => {
      state = R.dissocPath(R.concat([modelName, id], [f, 'errors']), state)
    }, fields)
    return state
  }

  /**
   * Dispatched by [detailAttributeEditSubmitCheck](./validationepic.html#detail_attribute_edit_submit_check)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, fieldName: string, id: string}}
   * @returns Updates conveyor.model.modelName.values.id.fieldName with the updated value in state
   */
  [DETAIL_ATTRIBUTE_EDIT_SUBMIT](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, fieldName } = { ...payload }
    return R.dissocPath([modelName, id, fieldName, 'errors'], state)
  }

  /**
   * Dispatched each time input is changed while editing.
   * @param state Redux state
   * @param action object {type: string, payload: {id: string, modelName: string, fieldName: string, value: any}}
   * @returns Updates conveyor.edit.modelName.id.fieldName.currentValue with the updated value in state
   */
  [EDIT_INPUT_CHANGE](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, fieldName, value } = { ...payload }

    return R.assocPath(
      [modelName, id.toString(), fieldName, 'currentValue'],
      value,
      state
    )
  }

  /**
   * Dispatched when a validation error occurrs in 
   * [detailTableEditSubmitCheck](./validationepic.html#detail_table_edit_submit_check) and 
   * [indexEditSubmitCheck](./validationepic.html#index_edit_submit_check)
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, id: string, errors: object}}
   * @returns Adds error to conveyor.edit.parentModelName.parentId.fieldName.error in state
   */
  [VALIDATION_ERROR_TABLE_ROW](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, errors } = { ...payload }
    R.forEach((fieldNameError) => {
      state = R.assocPath(
        [modelName, id.toString(), fieldNameError, 'errors'],
        R.prop(fieldNameError, errors),
        state
      )
    }, Object.keys(errors))
    return state
  }
}
