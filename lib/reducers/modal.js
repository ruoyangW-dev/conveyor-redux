import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import * as R from 'ramda';
import * as Actions from '../actionConsts';
var initState = {};

var groupModels = function groupModels(collection, property) {
  var values = [];
  var result = [];

  for (var i = 0; i < collection.length; i++) {
    var val = collection[i][property];

    var index = _indexOfInstanceProperty(values).call(values, val);

    if (index > -1) {
      result[index].push(collection[i]);
    } else {
      values.push(val);
      result.push([collection[i]]);
    }
  }

  return result;
};

export var generateModalReducer = function generateModalReducer() {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case Actions.UPDATE_DELETE_DETAIL:
        {
          var deletes = R.path(['payload', 'data', 'checkDelete'], action);
          var groupedData = groupModels(deletes, '__typename');
          return _Object$assign({}, state, {
            Delete: groupedData
          });
        }

      case Actions.CANCEL_DELETE_DETAIL:
        {
          return _Object$assign({}, state, {
            Delete: undefined
          });
        }

      default:
        return state;
    }
  };
};
export var selectModal = function selectModal(state) {
  return R.prop('modal', state);
};
export var selectModalStore = function selectModalStore(state, modal) {
  return R.path(['modal', modal], state);
};