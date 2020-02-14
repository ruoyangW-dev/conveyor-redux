import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
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

var getCreateMutation = function getCreateMutation(schema, modelName) {
  var _context, _context2, _context3;

  var queryName = R.path([modelName, 'queryName'], schema);

  var mutationString = _concatInstanceProperty(_context = _concatInstanceProperty(_context2 = _concatInstanceProperty(_context3 = "\n        mutation Create".concat(modelName, "($input: ")).call(_context3, modelName, "InputRequired!) {\n            create")).call(_context2, modelName, "(input: $input) {\n                ")).call(_context, queryName, " {\n                  __typename\n                  id\n                }\n                errors\n            }\n        }\n    ");

  return "".concat(mutationString);
};

export var generateSaveCreateEpic = function generateSaveCreateEpic(schema, doRequest) {
  return function (actions$, state$) {
    return actions$.pipe(ofType(consts.SAVE_CREATE), map(R.prop('payload')), map(function (payload) {
      var formStack = selectCreate(state$.value);
      var query = getCreateMutation(schema, payload.modelName);
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