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

export class EditReducer extends Reducer {
  constructor(schema: SchemaBuilder) {
    super(schema, initState)
  }

  [LOCATION_CHANGE]() {
    return initState
  }

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

  [TABLE_EDIT_CANCEL](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id } = { ...payload }
    state = R.dissocPath([modelName, id], state)

    // if no ids for model are being edited, remove the model from the edit store
    if (R.isEmpty(R.prop(modelName, state))) {
      return R.dissoc(modelName, state)
    }
    return state
  }

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

  [VALIDATION_ERROR_EDIT](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, fieldName, errors } = { ...payload }
    R.forEach(fieldNameError => {
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

  [DETAIL_TABLE_EDIT_SUBMIT](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id } = { ...payload }
    const fields = Object.keys(R.path([modelName, id], state) as any)
    R.forEach(f => {
      state = R.dissocPath(R.concat([modelName, id], [f, 'errors']), state)
    }, fields)
    return state
  }

  [DETAIL_ATTRIBUTE_EDIT_SUBMIT](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, fieldName } = { ...payload }
    return R.dissocPath([modelName, id, fieldName, 'errors'], state)
  }

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

  [VALIDATION_ERROR_TABLE_ROW](state: any, action: any) {
    const payload = action.payload
    // @ts-ignore
    const { modelName, id, errors } = { ...payload }
    R.forEach(fieldNameError => {
      state = R.assocPath(
        [modelName, id.toString(), fieldNameError, 'errors'],
        R.prop(fieldNameError, errors),
        state
      )
    }, Object.keys(errors))
    return state
  }
}
