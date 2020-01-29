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
    var payload = action.payload;

    switch (action.type) {
      case Actions.INDEX_DELETE:
        {
          var _payload = _Object$assign({}, payload),
              modelName = _payload.modelName,
              id = _payload.id; // use modelName and id to delete model


          console.log('DELETE INDEX', modelName, id);
          return state;
        }

      case Actions.DETAIL_DELETE:
        {
          var _payload2 = _Object$assign({}, payload),
              _modelName = _payload2.modelName,
              _id = _payload2.id; // use modelName and id to delete model


          console.log('DELETE DETAIL', _modelName, _id);
          return state;
        }

      case Actions.DETAIL_DELETE_FROM_DETAIL_PAGE:
        {
          var _payload3 = _Object$assign({}, payload),
              _modelName2 = _payload3.modelName,
              _id2 = _payload3.id; // use modelName and id to delete model


          console.log('DELETE SELF', _modelName2, _id2);
          return state;
        }

      case Actions.DELETE_WARNING:
        {
          var _payload4 = _Object$assign({}, payload),
              _modelName3 = _payload4.modelName,
              _id3 = _payload4.id,
              rawDataList = _payload4.rawDataList; // fetch models that will be deleted if model is deleted


          console.log('DELETE WARNING', _modelName3, _id3); // note: raw data must have '__typename' in delete query. otherwise
          // delete warning table will not display correctly
          // group data into an array of arrays. each sub- array
          // holds model objects with name, __typename, & id attributes

          var groupedData = groupModels(rawDataList, '__typename'); // add to store

          return _Object$assign({}, state, {
            Delete: groupedData
          });
        }

      case Actions.CANCEL_DELETE:
        {
          // delete warning data from store
          return _Object$assign({}, state, {
            Delete: []
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