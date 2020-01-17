import _defineProperty from "@babel/runtime-corejs3/helpers/esm/defineProperty";
import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _toConsumableArray from "@babel/runtime-corejs3/helpers/esm/toConsumableArray";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import * as R from 'ramda';
import * as Actions from '../actionConsts';
import { getDisplayValue, getType, getFields } from 'conveyor';
var initState = {
  index: -1,
  stack: []
};

var stackPush = function stackPush(state, action) {
  var stack = R.prop('stack', state);
  var newIndex = R.prop('index', state) + 1;
  state = R.assoc('stack', R.append({
    modelName: R.path(['payload', 'modelName'], action)
  }, stack), state);
  state = R.assoc('index', newIndex, state);
  return R.assocPath(['stack', newIndex, 'fields'], {}, state);
};

var enterFormStack = function enterFormStack(state, action) {
  // clear the state
  state = initState; // get path where user originated before entering form stack

  var originPath = R.path(['payload', 'path'], action); // push new value to stack

  state = stackPush(state, action);
  return R.assoc('originPath', originPath, state);
}; // enter create stack from parent obj. detail page


var detailCreate = function detailCreate(schema, state, action) {
  var payload = R.prop('payload', action);
  var node = R.prop('node', payload); // since the create stack is entered from another object's detail page (parent object)
  // we must autopopulate the value of the related field (this is optional)
  // to do so, we must get the field name that the parent object is called on the
  // model we are creating, 'targetInverseFieldName'

  var targetInverseFieldName = R.prop('targetInverseFieldName', payload); // then we get the modelName of the parent detail page we originated from

  var parentModelName = R.pipe(R.prop('path'), R.split('/'), R.nth(1))(payload); // what the parent object instance is called

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
  }; // prepopulated field may have to take the form of a list if it is a 'ToMany' field

  var prepopulatedField = _includesInstanceProperty(type).call(type, 'ToMany') ? [fieldData] : fieldData; // add prepopulated field to the state, so that upon opening the create form
  // it will already be visible

  state = R.assocPath(['stack', 0, 'fields', targetInverseFieldName], prepopulatedField, enterFormStack(state, action)); // add originModelName/ originFieldName so that, when user exists for stack, the app will redirect
  // back where you came from (parent detail page)

  state = R.assoc('originModelName', parentModelName, state);
  state = R.assoc('originFieldName', targetInverseFieldName, state); // allows you to create the field label for the prepopulated parent field

  return R.assoc('originData', node, state);
};

var CreateValues = function CreateValues(schema, _ref) {
  var _context, _context2;

  var modelName = _ref.modelName,
      state = _ref.state;
  // get fields that should be create-able
  var createFields = R.filter(function (field) {
    return R.prop('showCreate', field);
  }, getFields(schema, modelName)); // get index of form stack being saved

  var formStackIndex = R.prop('index', state); // get origin page, if create stack entered from detail page

  var originModelName = R.prop('originModelName', state); // if created from detail page, auto-fill origin page with field data

  if (originModelName && formStackIndex === 0) {
    var originFieldName = R.prop('originFieldName', state);
    createFields[originFieldName] = originFieldName;
  } // get inputs from state, according to 'showCreate' in schema


  return _Object$assign.apply(Object, _concatInstanceProperty(_context = [{}]).call(_context, _toConsumableArray(_mapInstanceProperty(_context2 = _Object$keys(createFields)).call(_context2, function (fieldName) {
    return _defineProperty({}, fieldName, R.path(['stack', formStackIndex, 'fields', fieldName], state));
  }))));
};

var stackPop = function stackPop(state) {
  var stack = R.prop('stack', state); // pop latest entry from formStack and change index

  stack.pop();
  var newIndex = R.prop('index', state) - 1;
  state = R.assoc('stack', stack, state);
  return R.assoc('index', newIndex, state);
};

export var generateCreateReducer = function generateCreateReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var payload = action.payload;

    switch (action.type) {
      case Actions.INPUT_CHANGE:
        {
          var currentIndex = R.prop('index', state);
          return R.assocPath(['stack', currentIndex, 'fields', payload.fieldName], payload.value, state);
        }

      case Actions.CANCEL:
        {
          // pop the latest form off the stack
          return stackPop(state);
        }

      case Actions.SAVE:
        {
          var modelName = R.prop('modelName', payload); // use rawCreateValues to add to database

          var rawCreateValues = CreateValues(schema, {
            modelName: modelName,
            state: state
          });
          console.log('SAVE CREATE', rawCreateValues); // after successful save, call 'CANCEL' action

          return state;
        }

      case Actions.SAVE_SUCCESSFUL:
        {
          return stackPop(state);
        }

      case Actions.STACK_CREATE:
        {
          return stackPush(state, action);
        }

      case Actions.DETAIL_CREATE:
        {
          return detailCreate(schema, state, action);
        }

      case Actions.INDEX_CREATE:
        {
          return enterFormStack(state, action);
        }

      case Actions.BREADCRUMB_CLICK:
        {
          return R.assoc('index', R.path(['payload', 'index'], action), state);
        }

      default:
        return state;
    }
  };
};
export var selectCreate = function selectCreate(state) {
  return R.prop('create', state);
};