import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import * as R from 'ramda';
import * as Actions from '../actionConsts';
import { getDisplayValue, getType } from 'conveyor';
var initState = {
  index: -1,
  stack: []
};

var handleStackPop = function handleStackPop(state) {
  var stack = R.prop('stack', state);
  stack.pop();
  var newIndex = R.prop('index', state) - 1;
  state = R.assoc('stack', stack, state);
  return R.assoc('index', newIndex, state);
};

var handleStackPush = function handleStackPush(state, action) {
  var stack = R.prop('stack', state);
  var newIndex = R.prop('index', state) + 1;
  state = R.assoc('stack', R.append({
    modelName: R.path(['payload', 'modelName'], action)
  }, stack), state);
  state = R.assoc('index', newIndex, state);
  return R.assocPath(['stack', newIndex, 'fields'], {}, state);
};

export var clearFormStack = function clearFormStack() {
  return initState;
};

var handleEnterFormStack = function handleEnterFormStack(state, action) {
  state = clearFormStack();
  var originPath = R.path(['payload', 'path'], action);
  state = handleStackPush(state, action);
  return R.assoc('originPath', originPath, state);
};

var handleDetailCreate = function handleDetailCreate(schema, state, action) {
  var payload = R.prop('payload', action);
  var node = R.prop('node', payload);
  var targetInverseFieldName = R.prop('targetInverseFieldName', payload);
  var parentModelName = R.pipe(R.prop('path'), R.split('/'), R.nth(1))(payload);
  var parentName = getDisplayValue({
    schema: schema,
    modelName: parentModelName,
    node: node
  });
  var parentId = R.prop('id', node);
  var type = getType({
    schema: schema,
    modelName: R.path(['payload', 'modelName'], action),
    fieldName: targetInverseFieldName
  });
  var fieldData = {
    label: parentName,
    value: parentId,
    disabled: true
  };
  var prepopulatedField = _includesInstanceProperty(type).call(type, 'ToMany') ? [fieldData] : fieldData;
  state = R.assocPath(['stack', 0, 'fields', targetInverseFieldName], prepopulatedField, handleEnterFormStack(state, action));
  state = R.assoc('originModelName', parentModelName, state);
  state = R.assoc('originFieldName', targetInverseFieldName, state);
  return R.assoc('originNode', node, state);
};

var handleCreateInputChange = function handleCreateInputChange(state, action) {
  var currentIndex = R.prop('index', state);
  var payload = R.prop('payload', action);
  return R.assocPath(['stack', currentIndex, 'fields', payload.fieldName], payload.value, state);
};

var handleValidationErrorCreate = function handleValidationErrorCreate(state, action) {
  var payload = R.prop('payload', action);
  var stackIndex = R.prop('index', state);
  var errors = R.propOr([], 'errors', payload);
  R.forEach(function (fieldNameError) {
    state = R.assocPath(R.prop(fieldNameError, errors), ['stack', stackIndex, 'errors', fieldNameError], state);
  }, _Object$keys(errors));
  return state;
};

var handleClearErrorSave = function handleClearErrorSave(state) {
  return R.dissocPath(['stack', R.prop('index', state), 'errors'], state);
};

export var generateCreateReducer = function generateCreateReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case Actions.CREATE_INPUT_CHANGE:
        return handleCreateInputChange(state, action);

      case Actions.CANCEL_CREATE:
      case Actions.SAVE_CREATE_SUCCESSFUL:
        return handleStackPop(state);

      case Actions.SAVE_CREATE:
        return handleClearErrorSave(state);

      case Actions.STACK_CREATE:
        return handleStackPush(state, action);

      case Actions.DETAIL_CREATE:
        return handleDetailCreate(schema, state, action);

      case Actions.INDEX_CREATE:
        return handleEnterFormStack(state, action);

      case Actions.UPDATE_FORM_STACK_INDEX:
        return R.assoc('index', R.path(['payload', 'index'], action), state);

      case Actions.VALIDATION_ERROR_CREATE:
        return handleValidationErrorCreate(state, action);

      default:
        return state;
    }
  };
};
export var selectCreate = function selectCreate(state) {
  return R.propOr(initState, 'create', state);
};