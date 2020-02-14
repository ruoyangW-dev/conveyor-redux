import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import * as Actions from '../actions';
import * as consts from '../actionConsts';
import * as R from 'ramda';
import { getFilters, getSort } from '../utils/helpers';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { selectTableView } from '../reducers/tableView';
import { getModelLabel } from 'conveyor';
import { concat } from 'rxjs';
import * as Logger from '../utils/Logger';

var getDeleteMutation = function getDeleteMutation(schema, modelName) {
  var _context, _context2;

  var queryName = R.path([modelName, 'queryName'], schema);

  var mutationString = _concatInstanceProperty(_context = _concatInstanceProperty(_context2 = "\n        mutation Delete".concat(modelName, "($id: Int!) {\n            delete")).call(_context2, modelName, "(id: $id) {\n                ")).call(_context, queryName, " {\n                  __typename\n                  id\n                }\n                errors\n            }\n        }\n    ");

  return "".concat(mutationString);
};

var getDeleteErrors = function getDeleteErrors(_ref) {
  var data = _ref.data,
      context = _ref.context;
  return R.path(['delete' + context.modelName, 'errors'], data);
};

export var generateFetchModelIndexEpic = function generateFetchModelIndexEpic(schema, doRequest) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.FETCH_MODEL_INDEX), map(R.prop('payload')), map(function (payload) {
      var variables = {
        filter: getFilters({
          schema: schema,
          modelName: payload.modelName,
          tableView: selectTableView(state$.value)
        }),
        sort: getSort({
          schema: schema,
          modelName: payload.modelName,
          tableView: selectTableView(state$.value)
        })
      };
      return {
        modelName: payload.modelName,
        variables: variables
      };
    }), mergeMap(function (context) {
      var query = doRequest.buildQuery({
        modelName: context.modelName,
        queryType: 'index'
      });
      return doRequest.sendRequest({
        query: query,
        variables: context.variables
      }).then(function (_ref2) {
        var data = _ref2.data,
            error = _ref2.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), map(function (_ref3) {
      var context = _ref3.context,
          data = _ref3.data,
          error = _ref3.error;

      if (error) {
        return Actions.addDangerAlert({
          message: "Error loading ".concat(context.modelName, " index.")
        });
      }

      return Actions.updateModelIndex({
        modelName: context.modelName,
        data: data
      });
    }));
  };
};
export var generateFetchModelDetailEpic = function generateFetchModelDetailEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.FETCH_MODEL_DETAIL), map(R.prop('payload')), map(function (payload) {
      var variables = {
        id: payload.id
      };
      return {
        modelName: payload.modelName,
        id: payload.id,
        variables: variables
      };
    }), mergeMap(function (context) {
      var query = doRequest.buildQuery({
        modelName: context.modelName,
        queryType: 'detail'
      });
      return doRequest.sendRequest({
        query: query,
        variables: context.variables
      }).then(function (_ref4) {
        var data = _ref4.data,
            error = _ref4.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), map(function (_ref5) {
      var context = _ref5.context,
          data = _ref5.data,
          error = _ref5.error;

      if (error) {
        return Actions.addDangerAlert({
          message: "Error loading ".concat(context.modelName, " details.")
        });
      }

      return Actions.updateModelDetail({
        modelName: context.modelName,
        id: context.id,
        data: data
      });
    }));
  };
};
export var generateRequestDeleteModelEpic = function generateRequestDeleteModelEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.REQUEST_DELETE_MODEL), map(R.prop('payload')), map(function (payload) {
      var query = getDeleteMutation(schema, payload.modelName);
      var variables = {
        id: payload.id
      };
      return {
        modelName: payload.modelName,
        id: payload.id,
        query: query,
        variables: variables
      };
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref6) {
        var data = _ref6.data,
            error = _ref6.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), switchMap(function (_ref7) {
      var context = _ref7.context,
          data = _ref7.data,
          error = _ref7.error;
      var displayName = getModelLabel({
        schema: schema,
        modelName: context.modelName
      }); // get errors from context

      var errors = getDeleteErrors({
        data: data,
        context: context
      });

      if (errors) {
        var _context3;

        Logger.epicError('requestDeleteModelEpic', context, error);
        var contactErrors = R.join('. ', errors);
        return concat([Actions.addDangerAlert({
          message: _concatInstanceProperty(_context3 = "Error deleting ".concat(displayName, ". ")).call(_context3, contactErrors)
        })]);
      } // get errors from 'error' prop


      if (error) {
        Logger.epicError('requestDeleteModelEpic', context, error);
        return concat([Actions.addDangerAlert({
          message: "Error deleting ".concat(displayName, ".")
        })]);
      }

      return concat([Actions.updateDeleteModel({
        modelName: context.modelName,
        id: context.id
      }), Actions.addSuccessAlert({
        message: "".concat(displayName, " was successfully deleted.")
      })]);
    }));
  };
}; // deletes child, then fetchs parent detail

export var generateRequestDeleteRelTableModelEpic = function generateRequestDeleteRelTableModelEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.REQUEST_DELETE_REL_TABLE_MODEL), map(R.prop('payload')), map(function (payload) {
      var query = getDeleteMutation(schema, payload.modelName);
      var variables = {
        id: payload.id
      };
      return _Object$assign({}, payload, {
        query: query,
        variables: variables
      });
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref8) {
        var data = _ref8.data,
            error = _ref8.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), switchMap(function (_ref9) {
      var context = _ref9.context,
          data = _ref9.data,
          error = _ref9.error;
      var displayName = getModelLabel({
        schema: schema,
        modelName: context.modelName
      }); // get errors from context

      var errors = getDeleteErrors({
        data: data,
        context: context
      });

      if (errors) {
        var _context4;

        Logger.epicError('requestDeleteModelEpic', context, error);
        var contactErrors = R.join('. ', errors);
        return concat([Actions.addDangerAlert({
          message: _concatInstanceProperty(_context4 = "Error deleting ".concat(displayName, ". ")).call(_context4, contactErrors)
        })]);
      }

      if (error) {
        Logger.epicError('requestDeleteRelTableModelEpic', context, error);
        return concat([Actions.addDangerAlert({
          message: "Error deleting ".concat(displayName, ".")
        })]);
      }

      return concat([Actions.fetchModelDetail({
        modelName: context.parentModel,
        id: context.parentId
      }), Actions.addSuccessAlert({
        message: "".concat(displayName, " was successfully deleted.")
      })]);
    }));
  };
};
export var generateRequestDeleteModelFromDetailPageEpic = function generateRequestDeleteModelFromDetailPageEpic(schema, doRequest) {
  return function (action$) {
    return action$.pipe(ofType(consts.REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE), map(R.prop('payload')), map(function (payload) {
      var query = getDeleteMutation(schema, payload.modelName);
      var variables = {
        id: payload.id
      };
      return {
        modelName: payload.modelName,
        id: payload.id,
        query: query,
        variables: variables
      };
    }), mergeMap(function (context) {
      return doRequest.sendRequest({
        query: context.query,
        variables: context.variables
      }).then(function (_ref10) {
        var data = _ref10.data,
            error = _ref10.error;
        return {
          context: context,
          data: data,
          error: error
        };
      });
    }), switchMap(function (_ref11) {
      var context = _ref11.context,
          data = _ref11.data,
          error = _ref11.error;
      var displayName = getModelLabel({
        schema: schema,
        modelName: context.modelName
      }); // get errors from context

      var errors = getDeleteErrors({
        data: data,
        context: context
      });

      if (errors) {
        var _context5;

        Logger.epicError('requestDeleteModelEpic', context, error);
        var contactErrors = R.join('. ', errors);
        return concat([Actions.addDangerAlert({
          message: _concatInstanceProperty(_context5 = "Error deleting ".concat(displayName, ". ")).call(_context5, contactErrors)
        })]);
      }

      if (error) {
        Logger.epicError('requestDeleteModelFromDetailPageEpic', context, error);
        return concat([Actions.addDangerAlert({
          message: "Error deleting ".concat(displayName, ".")
        })]);
      }

      return concat([Actions.removeInstance({
        modelName: context.modelName,
        id: context.id
      }), Actions.addSuccessAlert({
        message: "".concat(displayName, " was successfully deleted.")
      })]);
    }));
  };
};