import { ofType } from 'redux-observable'
import { concat } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import * as R from 'ramda'
import * as consts from '../actionConsts'
import * as Actions from '../actions'
import * as Logger from '../utils/Logger'
import { getFields, inputTypes } from '@autoinvent/conveyor'
import { selectCreate } from '../utils/create'
import {
  getCreateSubmitValues,
  isValidationError,
  prepValidationErrors
} from '../utils/helpers'

export const generateSaveCreateEpic = (schema, doRequest) => (
  actions$,
  state$
) =>
  actions$.pipe(
    ofType(consts.SAVE_CREATE),
    map(R.prop('payload')),
    map(payload => {
      const formStack = selectCreate(state$.value)
      const query = doRequest.buildQuery({
        modelName: payload.modelName,
        queryType: 'create'
      })
      const createValues = getCreateSubmitValues({
        schema,
        formStack,
        modelName: payload.modelName
      })

      const imageFields = R.filter(
        obj => R.prop('type', obj) === inputTypes.FILE_TYPE,
        getFields(schema, payload.modelName)
      )
      const imageFieldsList = Object.keys(imageFields)
      const omitList = R.append('id', imageFieldsList)

      const variables = {
        input: R.omit(omitList, createValues)
      }

      return {
        modelName: payload.modelName,
        variables,
        query,
        inputWithFile: R.filter(
          n => !R.isNil(n),
          R.pick(imageFieldsList, createValues)
        )
      }
    }),
    mergeMap(context =>
      doRequest
        .sendRequest({
          query: context.query,
          variables: context.variables
        })
        .then(({ data, error }) => ({ context, data, error }))
    ),
    mergeMap(({ context, data, error }) => {
      if (error) {
        Logger.epicError('saveCreateEpic', context, error)
        const errorActions = []
        if (isValidationError(error.response)) {
          const errors = prepValidationErrors({ schema, context, error })
          errorActions.push(Actions.onValidationErrorCreate({ errors }))
        }
        errorActions.push(
          Actions.addDangerAlert({ message: 'Error submitting form.' })
        )
        return concat(errorActions)
      }

      let actions = [
        Actions.addSuccessAlert({
          message: `${context.modelName} successfully created.`
        })
      ]

      const IdPath = [
        'create' + context.modelName,
        R.path([context.modelName, 'queryName'], schema), // camelcase modelName
        'id'
      ]

      // images exist
      if (!R.isEmpty(R.prop('inputWithFile', context))) {
        actions = R.append(
          Actions.onInlineFileSubmit({
            modelName: context.modelName,
            id: R.path(IdPath, data),
            fileData: context.inputWithFile,
            fromCreate: true
          }),
          actions
        )
      } else {
        // createSuccessful called in inlineFileSubmit; otherwise prepend it here
        actions = R.prepend(Actions.onSaveCreateSuccessful({}), actions)
      }

      return concat(actions)
    })
  )
