import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import { ofType } from 'redux-observable';
import { concat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as R from 'ramda';
import * as consts from '../actionConsts';
import * as Actions from '../actions';
import * as Logger from '../utils/Logger';
import { getFields, inputTypes } from 'conveyor';
import { selectCreate } from '../reducers/create';
import { getCreateSubmitValues, isValidationError, prepValidationErrors } from '../utils/helpers';
export var generateSaveCreateEpic = function generateSaveCreateEpic(schema, doRequest) {
  return function (actions$, state$) {
    return actions$.pipe(ofType(consts.SAVE_CREATE), map(R.prop('payload')), map(function (payload) {
      var formStack = selectCreate(state$.value);
      var query = doRequest.buildQuery({
        modelName: payload.modelName,
        queryType: 'create'
      });
      var createValues = getCreateSubmitValues({
        schema: schema,
        formStack: formStack,
        modelName: payload.modelName
      });
      var imageFields = R.filter(function (obj) {
        return R.prop('type', obj) === inputTypes.FILE_TYPE;
      }, getFields(schema, payload.modelName));

      var imageFieldsList = _Object$keys(imageFields);

      var omitList = R.append('id', imageFieldsList);
      var variables = {
        input: R.omit(omitList, createValues)
      };
      return {
        modelName: payload.modelName,
        variables: variables,
        query: query,
        inputWithFile: R.filter(function (n) {
          return !R.isNil(n);
        }, R.pick(imageFieldsList, createValues))
      };
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref) {
        var data = _ref.data,
            error = _ref.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), mergeMap(function (_ref2) {
      var context = _ref2.context,
          data = _ref2.data,
          error = _ref2.error;

      if (error) {
        Logger.epicError('saveCreateEpic', context, error);
        var errorActions = [];

        if (isValidationError(error.response)) {
          var errors = prepValidationErrors({
            schema: schema,
            context: context,
            error: error
          });
          errorActions.push(Actions.onValidationErrorCreate({
            errors: errors
          }));
        }

        errorActions.push(Actions.addDangerAlert({
          message: 'Error submitting form.'
        }));
        return concat(errorActions);
      }

      var actions = [Actions.addSuccessAlert({
        message: "".concat(context.modelName, " successfully created.")
      })];
      var IdPath = ['create' + context.modelName, R.path([context.modelName, 'queryName'], schema), // camelcase modelName
      'id']; // images exist

      if (!R.isEmpty(R.prop('inputWithFile', context))) {
        actions = R.append(Actions.onInlineFileSubmit({
          modelName: context.modelName,
          id: R.path(IdPath, data),
          fileData: context.inputWithFile,
          fromCreate: true
        }), actions);
      } else {
        // createSuccessful called in inlineFileSubmit; otherwise prepend it here
        actions = R.prepend(Actions.onSaveCreateSuccessful({}), actions);
      }

      return concat(actions);
    }));
  };
};