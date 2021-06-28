import * as R from 'ramda'
import {
  initState,
  handleCreateInputChange,
  handleStackPop,
  handleClearErrorSave,
  handleStackPush,
  handleDetailCreate,
  handleEnterFormStack,
  handleValidationErrorCreate
} from '../utils/create'
import {
  CREATE_INPUT_CHANGE,
  CANCEL_CREATE,
  SAVE_CREATE_SUCCESSFUL,
  SAVE_CREATE,
  STACK_CREATE,
  DETAIL_CREATE,
  INDEX_CREATE,
  UPDATE_FORM_STACK_INDEX,
  VALIDATION_ERROR_CREATE
} from '../actionConsts'
import { Reducer } from './reducer'
import { SchemaBuilder } from '@autoinvent/conveyor-schema'
import { Config } from '../types'

/**
 * A class containing reducers handling actions from the Create page
 */
export class CreateReducer extends Reducer {
  /**
   * Creates a reducer object which can reduce all reducers into one
   * @param schema - [Conveyor-Schema](https://github.com/autoinvent/conveyor-schema)
   * @param config Custom user inputted configurations
   */
  constructor(schema: SchemaBuilder, config: Config) {
    super(schema, initState, config)
  }

  /**
   * Dispatched each time an input changes on the Create page.
   * @param state Redux state
   * @param action object {type: string, payload: {fieldName: string, value: any}}
   * @returns - Updates conveyor.create.stack.index.fields.fieldName with the new input in state
   */
  [CREATE_INPUT_CHANGE](state: any, action: any) {
    return handleCreateInputChange(state, action)
  }

  /**
   * Dispatched whenever pressing cancel on the Create page.
   * @param state Redux state
   * @returns - In state, decrements conveyor.create.index and sets value of conveyor.create.stack.index to null where
   * index is the current form stack index
   */
  [CANCEL_CREATE](state: any) {
    return handleStackPop(state)
  }

  /**
   * Dispatched from [onSaveCreate](./createepic.html#save_create) and
   * [onInlineFileSubmit](./editepic.html#inline_file_submit)
   * @param state Redux state
   * @returns - Decrements value conveyor.create.index in state
   */
  [SAVE_CREATE_SUCCESSFUL](state: any) {
    return handleStackPop(state)
  }

  /**
   * Dispatched after submitting a form on the Create page.
   * @param state Redux state
   * @returns - Sets value of conveyor.create.stack.index to null where index is the current page on the form stack
   */
  [SAVE_CREATE](state: any) {
    return handleClearErrorSave(state)
  }

  /**
   * Dispatched when pushing another model to the form stack on the Create page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string}}
   * @returns - Increments value of conveyor.create.index, and adds object {modelName: string, fields: object} to
   * conveyor.create.stack.index in state
   */
  [STACK_CREATE](state: any, action: any) {
    return handleStackPush(state, action)
  }

  /**
   * Dispatched when creating a One-To-Many relation field from the Detail page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, path: string,
   * targetInverseFieldName: string, node: object}}
   * @returns Predefines conveyor.create.stack.index.fields.parentModelName with parentModel's data,
   * conveyor.create.originPath, and conveyor.create.originNode to object {parentId: string, parentDisplayValue: string}
   * (By default 'parentDisplayValue' is 'name')
   */
  [DETAIL_CREATE](state: any, action: any) {
    return handleDetailCreate(this.schema, state, action)
  }

  /**
   * Dispatched when creating a model instance from the Index page.
   * @param state Redux state
   * @param action object {type: string, payload: {modelName: string, path: string}}
   * @returns - Increments conveyor.create.index, and updates conveyor.create.stack.index, and conveyor.create.originPath
   */
  [INDEX_CREATE](state: any, action: any) {
    return handleEnterFormStack(state, action)
  }

  /**
   * Dispatched when switching between form stack index.
   * @param state Redux state
   * @param action object {type: string, payload: {index: number}}
   * @returns Updates conveyor.create.index to the selected index on form stack
   */
  [UPDATE_FORM_STACK_INDEX](state: any, action: any) {
    return R.assoc('index', R.path(['payload', 'index'], action), state)
  }

  /**
   * Dispatched when a validation error occurs in [onSaveCreate](./createepic.html#save_create)
   * @param state Redux state
   * @param action object {type: string, payload: {erorrs: object}}
   * @returns - Updates conveyor.create.stack.stackIndex.error.fieldNameError with errors
   */
  [VALIDATION_ERROR_CREATE](state: any, action: any) {
    return handleValidationErrorCreate(state, action)
  }
}
