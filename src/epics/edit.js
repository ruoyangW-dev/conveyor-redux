import { ofType } from 'redux-observable'
import { concat } from 'rxjs'
import { map, mergeMap, switchMap } from 'rxjs/operators'
import {
  getFieldLabel,
  getFields,
  inputTypes,
  getModelLabel
} from '@autoinvent/conveyor'
import * as R from 'ramda'
import * as Actions from '../actions'
import {
  DETAIL_ATTRIBUTE_EDIT_SUBMIT,
  DETAIL_TABLE_EDIT_SUBMIT,
  DETAIL_TABLE_REMOVE_SUBMIT,
  INDEX_EDIT_SUBMIT,
  INLINE_FILE_DELETE,
  INLINE_FILE_SUBMIT,
  DELETE_FILE
} from '../actionConsts'
import * as Logger from '../utils/Logger'
import {
  editFieldToQueryInput,
  isValidationError,
  prepValidationErrors,
  getEditMutationInputVariables,
  getDeleteErrors,
  fileSubmitToBlob
} from '../utils/helpers'
import { Epic } from './epic'

export class EditEpic extends Epic {
  [DETAIL_ATTRIBUTE_EDIT_SUBMIT](action$, state$) {
    return action$.pipe(
      ofType(DETAIL_ATTRIBUTE_EDIT_SUBMIT),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const fieldName = R.prop('fieldName', payload)
        const id = R.prop('id', payload)
        const value = R.path(
          [
            'value',
            'conveyor',
            'edit',
            modelName,
            id,
            fieldName,
            'currentValue'
          ],
          state$
        )
        const inputValue = editFieldToQueryInput({
          schema: this.schema,
          modelName,
          fieldName,
          value
        })
        const variables = { id, input: { [fieldName]: inputValue } }
        const query = this.doRequest.buildQuery({
          modelName,
          queryType: 'update'
        })

        return { id, modelName, variables, query, fieldName }
      }),
      mergeMap(context =>
        this.doRequest
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ error }) => ({ context, error }))
      ),
      switchMap(({ context, error }) => {
        if (error) {
          Logger.epicError('detailAttributeEditSubmitEpic', context, error)
          const actions = []
          if (isValidationError(error.response)) {
            const errors = prepValidationErrors({
              schema: this.schema,
              context,
              error
            })
            actions.push(
              Actions.onValidationErrorEdit({
                modelName: context.modelName,
                id: context.id,
                fieldName: context.fieldName,
                errors
              })
            )
          }
          actions.push(
            Actions.addDangerAlert({ message: 'Error submitting edit.' })
          )
          return concat(actions)
        }
        return concat([
          Actions.onAttributeEditCancel(
            R.pick(['modelName', 'id', 'fieldName'], context)
          ),
          Actions.fetchModelDetail({
            modelName: context.modelName,
            id: context.id
          })
        ])
      })
    )
  }

  [DETAIL_TABLE_EDIT_SUBMIT](action$) {
    return action$.pipe(
      ofType(DETAIL_TABLE_EDIT_SUBMIT),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const parentModelName = R.prop('parentModelName', payload)
        const parentId = R.prop('parentId', payload)
        const id = R.prop('id', payload)
        const node = R.prop('changedFields', payload)

        const imageFields = R.filter(
          obj => R.prop('type', obj) === inputTypes.FILE_TYPE,
          getFields(this.schema, payload.modelName)
        )
        const imageFieldsList = Object.keys(imageFields)

        const input = getEditMutationInputVariables({
          schema: this.schema,
          modelName,
          node
        })
        const normalInput = R.omit(imageFieldsList, input)
        const variables = { id, input: { ...normalInput } }
        const query = this.doRequest.buildQuery({
          modelName,
          queryType: 'update'
        })
        return {
          id,
          modelName,
          variables,
          query,
          parentModelName,
          parentId,
          inputWithFile: R.filter(
            n => !R.isNil(n),
            R.pick(imageFieldsList, input)
          )
        }
      }),
      mergeMap(context =>
        this.doRequest
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      switchMap(({ context, data, error }) => {
        if (error) {
          Logger.epicError('detailTableEditSubmitEpic', context, error)
          const actions = []
          if (isValidationError(error.response)) {
            const errors = prepValidationErrors({
              schema: this.schema,
              context,
              error
            })
            actions.push(
              Actions.onValidationErrorTableRow({
                modelName: context.modelName,
                id: context.id,
                errors
              })
            )
          }
          actions.push(
            Actions.addDangerAlert({ message: 'Error submitting edit.' })
          )
          return concat(actions)
        }

        let actions = [
          Actions.onTableEditCancel(R.pick(['modelName', 'id'], context))
        ]

        // images exist
        if (!R.isEmpty(R.prop('inputWithFile', context))) {
          const path = [
            'update' + context.modelName,
            R.path([context.modelName, 'queryName'], this.schema), // camelcase modelName
            'id'
          ]

          actions = R.append(
            Actions.onInlineFileSubmit({
              modelName: context.modelName,
              id: R.path(path, data),
              fileData: context.inputWithFile,
              parentModelName: context.parentModelName,
              parentId: context.parentId
            }),
            actions
          )
        } else {
          // fetchModelDetail called in inlineFileSubmit; otherwise append it here:
          actions = R.append(
            Actions.fetchModelDetail({
              modelName: context.parentModelName,
              id: context.parentId
            }),
            actions
          )
        }

        return concat(actions)
      })
    )
  }

  [DETAIL_TABLE_REMOVE_SUBMIT](action$, state$) {
    return action$.pipe(
      ofType(DETAIL_TABLE_REMOVE_SUBMIT),
      map(R.prop('payload')),
      map(payload => {
        const { modelName, fieldName, id, removedId } = { ...payload }

        const query = this.doRequest.buildQuery({
          modelName,
          queryType: 'update'
        })

        const updatedFieldList = R.pipe(
          R.pathOr(
            [],
            ['value', 'conveyor', 'model', modelName, 'values', id, fieldName]
          ),
          R.map(obj => obj.id),
          R.without([removedId])
        )(state$)

        const variables = {
          id: Number(id),
          input: { [fieldName]: updatedFieldList }
        }
        return { ...payload, query, variables }
      }),
      mergeMap(context =>
        this.doRequest
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      switchMap(({ context, data, error }) => {
        const displayName = getModelLabel({
          schema: this.schema,
          modelName: context.modelName
        })
        const fieldLabel = getFieldLabel({
          schema: this.schema,
          modelName: context.modelName,
          fieldName: context.fieldName
        })

        // get errors from context
        const errors = getDeleteErrors({ data, context })
        if (errors) {
          Logger.epicError('detailTableRemoveSubmitEpic', context, error)
          const contactErrors = R.join('. ', errors)
          return concat([
            Actions.addDangerAlert({
              message: `Error removing ${fieldLabel}. ${contactErrors}`
            })
          ])
        }

        if (error) {
          Logger.epicError('detailTableRemoveSubmitEpic', context, error)
          return Actions.addDangerAlert({
            message: `Error removing ${fieldLabel}.`
          })
        }

        return concat([
          Actions.fetchModelDetail({
            modelName: context.modelName,
            id: context.id
          }),
          Actions.addSuccessAlert({
            message: `"${fieldLabel}" object was successfully removed from "${displayName}".`
          })
        ])
      })
    )
  }

  [INDEX_EDIT_SUBMIT](action$) {
    return action$.pipe(
      ofType(INDEX_EDIT_SUBMIT),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const id = R.prop('id', payload)
        const node = R.prop('changedFields', payload)
        const input = getEditMutationInputVariables({
          schema: this.schema,
          modelName,
          node
        })
        const variables = { id, input: { ...input } }
        const query = this.doRequest.buildQuery({
          modelName,
          queryType: 'update'
        })

        return { id, modelName, variables, query }
      }),
      mergeMap(context =>
        this.doRequest
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ error }) => ({ context, error }))
      ),
      switchMap(({ context, error }) => {
        if (error) {
          Logger.epicError('indexEditSubmitEpic', context, error)
          const actions = []
          if (isValidationError(error.response)) {
            const errors = prepValidationErrors({
              schema: this.schema,
              context,
              error
            })
            actions.push(
              Actions.onValidationErrorTableRow({
                modelName: context.modelName,
                id: context.id,
                errors
              })
            )
          }
          actions.push(
            Actions.addDangerAlert({ message: 'Error submitting edit.' })
          )
          return concat(actions)
        }

        return concat([
          Actions.onTableEditCancel(R.pick(['modelName', 'id'], context)),
          Actions.fetchModelIndex({ modelName: context.modelName })
        ])
      })
    )
  }

  [INLINE_FILE_DELETE](action$) {
    return action$.pipe(
      ofType(INLINE_FILE_DELETE),
      map(R.prop('payload')),
      map(payload => {
        const fieldName = R.prop('fieldName', payload)
        const modelName = R.prop('modelName', payload)
        const id = R.prop('id', payload)
        return {
          query: this.doRequest.buildQuery({
            modelName,
            queryType: 'update'
          }),
          id,
          modelName,
          variables: {
            input: {
              [fieldName]: DELETE_FILE
            },
            id
          }
        }
      }),
      mergeMap(context =>
        this.doRequest
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ error }) => ({ context, error }))
      ),
      switchMap(({ context, error }) => {
        if (error) {
          Logger.epicError('inlineFileDeleteEpic', context, error)
          return concat([
            Actions.addDangerAlert({ message: 'Error deleting file.' })
          ])
        }
        return concat([
          Actions.fetchModelDetail({
            modelName: context.modelName,
            id: context.id
          }),
          Actions.addSuccessAlert({ message: 'Successfully deleted file.' })
        ])
      })
    )
  }

  [INLINE_FILE_SUBMIT](action$, state$) {
    return action$.pipe(
      ofType(INLINE_FILE_SUBMIT),
      map(R.prop('payload')),
      map(payload => {
        const modelName = R.prop('modelName', payload)
        const fieldName = R.prop('fieldName', payload)
        const id = R.prop('id', payload)
        return {
          formData: fileSubmitToBlob({
            payload,
            query: this.doRequest.buildQuery({
              modelName,
              queryType: 'update'
            }),
            value: R.path(
              [
                'value',
                'conveyor',
                'edit',
                modelName,
                id,
                fieldName,
                'currentValue'
              ],
              state$
            )
          }),
          modelName: modelName,
          fieldName: fieldName,
          id: id,
          ...payload
        }
      }),
      mergeMap(context =>
        this.doRequest
          .sendRequest({
            formData: context.formData
          })
          .then(({ error }) => ({ context, error }))
      ),
      switchMap(({ context, error }) => {
        if (error) {
          Logger.epicError('inlineFileSubmitEpic', context, error)
          return concat([
            Actions.addDangerAlert({
              message: `Could not save Image for ${context.modelName}.`
            })
          ])
        }
        let actions = [
          Actions.onAttributeEditCancel({
            modelName: context.modelName,
            fieldName: context.fieldName,
            id: context.id
          }),
          Actions.fetchModelDetail({
            modelName: context.modelName,
            id: context.id
          })
        ]
        const parentModelName = R.prop('parentModelName', context)
        const parentId = R.prop('parentId', context)
        // if comes from detail table:
        if (parentModelName && parentId) {
          actions = R.append(
            Actions.fetchModelDetail({
              modelName: parentModelName,
              id: parentId
            }),
            actions
          )
        }
        if (R.prop('fromCreate', context)) {
          // comes from create page
          actions = R.append(Actions.onSaveCreateSuccessful({}), actions)
        }
        return concat(actions)
      })
    )
  }
}
