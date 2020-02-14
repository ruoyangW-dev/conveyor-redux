import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import _sliceInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/slice";
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import * as consts from '../actionConsts';
import * as R from 'ramda';
import * as Actions from '../actions';
import { getRequiredFields, getFieldLabel } from 'conveyor';

var tableChangedFields = function tableChangedFields(_ref) {
  var modelName = _ref.modelName,
      id = _ref.id,
      state$ = _ref.state$;
  return R.pipe(R.path(['value', 'edit', modelName, id]), R.filter(function (val) {
    return !R.equals(R.prop('currentValue', val), R.prop('initialValue', val));
  }), R.map(function (field) {
    return R.prop('currentValue', field);
  }))(state$);
};

var getMissingFieldsMessage = function getMissingFieldsMessage(_ref2) {
  var _context;

  var schema = _ref2.schema,
      missingFields = _ref2.missingFields,
      modelName = _ref2.modelName;
  return _sliceInstanceProperty(_context = R.reduce(function (acc, fieldName) {
    return acc + getFieldLabel({
      schema: schema,
      modelName: modelName,
      fieldName: fieldName
    }) + ', ';
  }, '', missingFields)).call(_context, 0, -2);
};

export var generateSaveCreateCheckEpic = function generateSaveCreateCheckEpic(schema) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.SAVE_CREATE_CHECK), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var stack = R.path(['value', 'formStack', 'stack'], state$);
      var fields = R.path([stack.length - 1, 'fields'], stack);
      var requiredFields = R.filter(function (val) {
        return val !== 'id';
      }, getRequiredFields(schema, modelName));

      var missingFields = _filterInstanceProperty(requiredFields).call(requiredFields, function (fieldName) {
        return !(fieldName in fields);
      });

      if (!R.isEmpty(missingFields)) {
        var message = getMissingFieldsMessage({
          schema: schema,
          missingFields: missingFields,
          modelName: modelName
        });
        return Actions.addDangerAlert({
          message: "Missing required field(s): ".concat(message)
        });
      } else {
        return Actions.onSaveCreate(_Object$assign({}, payload));
      }
    }));
  };
};
export var generateDetailAttributeEditSubmitCheckEpic = function generateDetailAttributeEditSubmitCheckEpic(schema) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.DETAIL_ATTRIBUTE_EDIT_SUBMIT_CHECK), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var fieldName = R.prop('fieldName', payload);
      var id = R.prop('id', payload);
      var currentValue = R.path(['value', 'edit', modelName, id, fieldName, 'currentValue'], state$);
      var initialValue = R.path(['value', 'edit', modelName, id, fieldName, 'initialValue'], state$); // check for changes to initial value

      if (R.equals(currentValue, initialValue)) {
        return Actions.onAttributeEditCancel({
          modelName: modelName,
          id: id,
          fieldName: fieldName
        });
      } // check for required field


      var requiredFields = R.filter(function (val) {
        return val !== 'id';
      }, getRequiredFields(schema, modelName));

      if (!currentValue && R.contains(fieldName, requiredFields)) {
        return Actions.addDangerAlert({
          message: "Missing required field: ".concat(fieldName, ".")
        });
      }

      return Actions.onDetailAttributeEditSubmit(_Object$assign({}, payload));
    }));
  };
};
export var generateDetailTableEditSubmitCheckEpic = function generateDetailTableEditSubmitCheckEpic(schema) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.DETAIL_TABLE_EDIT_SUBMIT_CHECK), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var id = R.prop('id', payload);
      var changedFields = tableChangedFields({
        modelName: modelName,
        id: id,
        state$: state$
      }); // check for changes to initial value(s)

      if (R.isEmpty(changedFields)) {
        return Actions.onTableEditCancel({
          modelName: modelName,
          id: id
        });
      } // check for required field(s)


      var requiredFields = R.filter(function (val) {
        return val !== 'id';
      }, getRequiredFields(schema, modelName));

      var missingFields = _filterInstanceProperty(requiredFields).call(requiredFields, function (fieldName) {
        return R.contains(fieldName, _Object$keys(changedFields)) && !R.prop(fieldName, changedFields);
      });

      if (!R.isEmpty(missingFields)) {
        var message = getMissingFieldsMessage({
          schema: schema,
          missingFields: missingFields,
          modelName: modelName
        });
        return Actions.addDangerAlert({
          message: "Missing required field(s): ".concat(message, ".")
        });
      }

      return Actions.onDetailTableEditSubmit(_Object$assign({
        id: id,
        modelName: modelName,
        changedFields: changedFields
      }, payload));
    }));
  };
};
export var generateIndexEditSubmitCheckEpic = function generateIndexEditSubmitCheckEpic(schema) {
  return function (action$, state$) {
    return action$.pipe(ofType(consts.INDEX_EDIT_SUBMIT_CHECK), map(R.prop('payload')), map(function (payload) {
      var modelName = R.prop('modelName', payload);
      var id = R.prop('id', payload);
      var changedFields = tableChangedFields({
        modelName: modelName,
        id: id,
        state$: state$
      }); // check for changes to initial value(s)

      if (R.isEmpty(changedFields)) {
        return Actions.onTableEditCancel({
          modelName: modelName,
          id: id
        });
      } // check for required field(s)


      var requiredFields = R.filter(function (val) {
        return val !== 'id';
      }, getRequiredFields(schema, modelName));

      var missingFields = _filterInstanceProperty(requiredFields).call(requiredFields, function (fieldName) {
        return R.contains(fieldName, _Object$keys(changedFields)) && !R.prop(fieldName, changedFields);
      });

      if (!R.isEmpty(missingFields)) {
        var message = getMissingFieldsMessage({
          schema: schema,
          missingFields: missingFields,
          modelName: modelName
        });
        return Actions.addDangerAlert({
          message: "Missing required field(s): ".concat(message, ".")
        });
      }

      return Actions.onIndexEditSubmit(_Object$assign({
        id: id,
        modelName: modelName,
        changedFields: changedFields
      }, payload));
    }));
  };
};