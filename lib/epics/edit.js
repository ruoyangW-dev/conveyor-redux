import "core-js/modules/es.number.constructor";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import _defineProperty from "@babel/runtime-corejs3/helpers/esm/defineProperty";
import { ofType } from 'redux-observable';
import { concat } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { getFieldLabel, getFields, inputTypes, getModelLabel } from 'conveyor';
import * as R from 'ramda';
import * as Actions from '../actions';
import * as consts from '../actionConsts';
import * as Logger from '../utils/Logger';
import { editFieldToQueryInput, isValidationError, prepValidationErrors, getEditMutationInputVariables, getDeleteErrors, fileSubmitToBlob } from '../utils/helpers';
export var generateDetailAttributeEditSubmitEpic = function generateDetailAttributeEditSubmitEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.DETAIL_ATTRIBUTE_EDIT_SUBMIT), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var fieldName = R.prop('fieldName', payload);
      var id = R.prop('id', payload);
      var value = R.path(['value', 'edit', modelName, id, fieldName, 'currentValue'], state$);
      var inputValue = editFieldToQueryInput({
        schema: schema,
        modelName: modelName,
        fieldName: fieldName,
        value: value
      });
      var variables = {
        id: id,
        input: _defineProperty({}, fieldName, inputValue)
      };
      var query = doRequest.buildQuery({
        modelName: modelName,
        queryType: 'update'
      });
      return {
        id: id,
        modelName: modelName,
        variables: variables,
        query: query,
        fieldName: fieldName
      };
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref) {
        var error = _ref.error;
        return {
          context: context,
          error: error
        };
      });
    }), switchMap(function (_ref2) {
      var context = _ref2.context,
          error = _ref2.error;

      if (error) {
        Logger.epicError('detailAttributeEditSubmitEpic', context, error);
        var actions = [];

        if (isValidationError(error.response)) {
          var errors = prepValidationErrors({
            schema: schema,
            context: context,
            error: error
          });
          actions.push(Actions.onValidationErrorEdit({
            modelName: context.modelName,
            id: context.id,
            fieldName: context.fieldName,
            errors: errors
          }));
        }

        actions.push(Actions.addDangerAlert({
          message: 'Error submitting edit.'
        }));
        return concat(actions);
      }

      return concat([Actions.onAttributeEditCancel(R.pick(['modelName', 'id', 'fieldName'], context)), Actions.fetchModelDetail({
        modelName: context.modelName,
        id: context.id
      })]);
    }));
  };
};
export var generateDetailTableEditSubmitEpic = function generateDetailTableEditSubmitEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.DETAIL_TABLE_EDIT_SUBMIT), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var parentModelName = R.prop('parentModelName', payload);
      var parentId = R.prop('parentId', payload);
      var id = R.prop('id', payload);
      var node = R.prop('changedFields', payload);
      var imageFields = R.filter(function (obj) {
        return R.prop('type', obj) === inputTypes.FILE_TYPE;
      }, getFields(schema, payload.modelName));

      var imageFieldsList = _Object$keys(imageFields);

      var input = getEditMutationInputVariables({
        schema: schema,
        modelName: modelName,
        node: node
      });
      var normalInput = R.omit(imageFieldsList, input);
      var variables = {
        id: id,
        input: _Object$assign({}, normalInput)
      };
      var query = doRequest.buildQuery({
        modelName: modelName,
        queryType: 'update'
      });
      return {
        id: id,
        modelName: modelName,
        variables: variables,
        query: query,
        parentModelName: parentModelName,
        parentId: parentId,
        inputWithFile: R.filter(function (n) {
          return !R.isNil(n);
        }, R.pick(imageFieldsList, input))
      };
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref3) {
        var data = _ref3.data,
            error = _ref3.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), switchMap(function (_ref4) {
      var context = _ref4.context,
          data = _ref4.data,
          error = _ref4.error;

      if (error) {
        Logger.epicError('detailTableEditSubmitEpic', context, error);
        var _actions = [];

        if (isValidationError(error.response)) {
          var errors = prepValidationErrors({
            schema: schema,
            context: context,
            error: error
          });

          _actions.push(Actions.onValidationErrorTableRow({
            modelName: context.modelName,
            id: context.id,
            errors: errors
          }));
        }

        _actions.push(Actions.addDangerAlert({
          message: 'Error submitting edit.'
        }));

        return concat(_actions);
      }

      var actions = [Actions.onTableEditCancel(R.pick(['modelName', 'id'], context))]; // images exist

      if (!R.isEmpty(R.prop('inputWithFile', context))) {
        var path = ['update' + context.modelName, R.path([context.modelName, 'queryName'], schema), // camelcase modelName
        'id'];
        actions = R.append(Actions.onInlineFileSubmit({
          modelName: context.modelName,
          id: R.path(path, data),
          fileData: context.inputWithFile,
          parentModelName: context.parentModelName,
          parentId: context.parentId
        }), actions);
      } else {
        // fetchModelDetail called in inlineFileSubmit; otherwise append it here:
        actions = R.append(Actions.fetchModelDetail({
          modelName: context.parentModelName,
          id: context.parentId
        }), actions);
      }

      return concat(actions);
    }));
  };
};
export var generateDetailTableRemoveSubmitEpic = function generateDetailTableRemoveSubmitEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.DETAIL_TABLE_REMOVE_SUBMIT), map(R.prop('payload')), map(function (payload) {
      var _payload = _Object$assign({}, payload),
          modelName = _payload.modelName,
          fieldName = _payload.fieldName,
          id = _payload.id,
          removedId = _payload.removedId;

      var query = doRequest.buildQuery({
        modelName: modelName,
        queryType: 'update'
      });
      var updatedFieldList = R.pipe(R.pathOr([], ['value', 'model', modelName, 'values', id, fieldName]), R.map(function (obj) {
        return obj.id;
      }), R.without([removedId]))(state$);
      var variables = {
        id: Number(id),
        input: _defineProperty({}, fieldName, updatedFieldList)
      };
      return _Object$assign({}, payload, {
        query: query,
        variables: variables
      });
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref5) {
        var data = _ref5.data,
            error = _ref5.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), switchMap(function (_ref6) {
      var _context2;

      var context = _ref6.context,
          data = _ref6.data,
          error = _ref6.error;
      var displayName = getModelLabel({
        schema: schema,
        modelName: context.modelName
      });
      var fieldLabel = getFieldLabel({
        schema: schema,
        modelName: context.modelName,
        fieldName: context.fieldName
      }); // get errors from context

      var errors = getDeleteErrors({
        data: data,
        context: context
      });

      if (errors) {
        var _context;

        Logger.epicError('detailTableRemoveSubmitEpic', context, error);
        var contactErrors = R.join('. ', errors);
        return concat([Actions.addDangerAlert({
          message: _concatInstanceProperty(_context = "Error removing ".concat(fieldLabel, ". ")).call(_context, contactErrors)
        })]);
      }

      if (error) {
        Logger.epicError('detailTableRemoveSubmitEpic', context, error);
        return Actions.addDangerAlert({
          message: "Error removing ".concat(fieldLabel, ".")
        });
      }

      return concat([Actions.fetchModelDetail({
        modelName: context.modelName,
        id: context.id
      }), Actions.addSuccessAlert({
        message: _concatInstanceProperty(_context2 = "\"".concat(fieldLabel, "\" object was successfully removed from \"")).call(_context2, displayName, "\".")
      })]);
    }));
  };
};
export var generateIndexEditSubmitEpic = function generateIndexEditSubmitEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.INDEX_EDIT_SUBMIT), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var id = R.prop('id', payload);
      var node = R.prop('changedFields', payload);
      var input = getEditMutationInputVariables({
        schema: schema,
        modelName: modelName,
        node: node
      });
      var variables = {
        id: id,
        input: _Object$assign({}, input)
      };
      var query = doRequest.buildQuery({
        modelName: modelName,
        queryType: 'update'
      });
      return {
        id: id,
        modelName: modelName,
        variables: variables,
        query: query
      };
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref7) {
        var error = _ref7.error;
        return {
          context: context,
          error: error
        };
      });
    }), switchMap(function (_ref8) {
      var context = _ref8.context,
          error = _ref8.error;

      if (error) {
        Logger.epicError('indexEditSubmitEpic', context, error);
        var actions = [];

        if (isValidationError(error.response)) {
          var errors = prepValidationErrors({
            schema: schema,
            context: context,
            error: error
          });
          actions.push(Actions.onValidationErrorTableRow({
            modelName: context.modelName,
            id: context.id,
            errors: errors
          }));
        }

        actions.push(Actions.addDangerAlert({
          message: 'Error submitting edit.'
        }));
        return concat(actions);
      }

      return concat([Actions.onTableEditCancel(R.pick(['modelName', 'id'], context)), Actions.fetchModelIndex({
        modelName: context.modelName
      })]);
    }));
  };
};
export var generateInlineFileDeleteEpic = function generateInlineFileDeleteEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.INLINE_FILE_DELETE), map(R.prop('payload')), map(function (payload) {
      var fieldName = R.prop('fieldName', payload);
      var modelName = R.prop('modelName', payload);
      var id = R.prop('id', payload);
      return {
        query: doRequest.buildQuery({
          modelName: modelName,
          queryType: 'update'
        }),
        id: id,
        modelName: modelName,
        variables: {
          input: _defineProperty({}, fieldName, consts.DELETE_FILE),
          id: id
        }
      };
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref9) {
        var error = _ref9.error;
        return {
          context: context,
          error: error
        };
      });
    }), switchMap(function (_ref10) {
      var context = _ref10.context,
          error = _ref10.error;

      if (error) {
        Logger.epicError('inlineFileDeleteEpic', context, error);
        return concat([Actions.addDangerAlert({
          message: 'Error deleting file.'
        })]);
      }

      return concat([Actions.fetchModelDetail({
        modelName: context.modelName,
        id: context.id
      }), Actions.addSuccessAlert({
        message: 'Successfully deleted file.'
      })]);
    }));
  };
};
export var generateInlineFileSubmitEpic = function generateInlineFileSubmitEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.INLINE_FILE_SUBMIT), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var fieldName = R.prop('fieldName', payload);
      var id = R.prop('id', payload);
      return _Object$assign({
        formData: fileSubmitToBlob({
          payload: payload,
          query: doRequest.buildQuery({
            modelName: modelName,
            queryType: 'update'
          }),
          value: R.path(['value', 'edit', modelName, id, fieldName, 'currentValue'], state$)
        }),
        modelName: modelName,
        fieldName: fieldName,
        id: id
      }, payload);
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        formData: context.formData
      }).then(function (_ref11) {
        var error = _ref11.error;
        return {
          context: context,
          error: error
        };
      });
    }), switchMap(function (_ref12) {
      var context = _ref12.context,
          error = _ref12.error;

      if (error) {
        Logger.epicError('inlineFileSubmitEpic', context, error);
        return concat([Actions.addDangerAlert({
          message: "Could not save Image for ".concat(context.modelName, ".")
        })]);
      }

      var actions = [Actions.onAttributeEditCancel({
        modelName: context.modelName,
        fieldName: context.fieldName,
        id: context.id
      }), Actions.fetchModelDetail({
        modelName: context.modelName,
        id: context.id
      })];
      var parentModelName = R.prop('parentModelName', context);
      var parentId = R.prop('parentId', context); // if comes from detail table:

      if (parentModelName && parentId) {
        actions = R.append(Actions.fetchModelDetail({
          modelName: parentModelName,
          id: parentId
        }), actions);
      }

      if (R.prop('fromCreate', context)) {
        // comes from create page
        actions = R.append(Actions.onSaveCreateSuccessful({}), actions);
      }

      return concat(actions);
    }));
  };
};