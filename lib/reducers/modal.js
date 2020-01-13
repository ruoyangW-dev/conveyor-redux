'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectModal = exports.generateModalReducer = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _actionConsts = require('../actionConsts');

var Actions = _interopRequireWildcard(_actionConsts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initState = {};

var groupModels = function groupModels(collection, property) {
  var values = [];
  var result = [];
  for (var i = 0; i < collection.length; i++) {
    var val = collection[i][property];
    var index = values.indexOf(val);
    if (index > -1) {
      result[index].push(collection[i]);
    } else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  return result;
};

var generateModalReducer = exports.generateModalReducer = function generateModalReducer(schema) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
    var action = arguments[1];

    var payload = action.payload;
    switch (action.type) {
      case Actions.INDEX_DELETE:
        {
          var _payload = { ...payload },
              modelName = _payload.modelName,
              id = _payload.id;
          // use modelName and id to delete model

          console.log('DELETE INDEX', modelName, id);
          return state;
        }
      case Actions.DETAIL_DELETE:
        {
          var _payload2 = { ...payload },
              _modelName = _payload2.modelName,
              _id = _payload2.id;
          // use modelName and id to delete model

          console.log('DELETE DETAIL', _modelName, _id);
          return state;
        }
      case Actions.DETAIL_DELETE_FROM_DETAIL_PAGE:
        {
          var _payload3 = { ...payload },
              _modelName2 = _payload3.modelName,
              _id2 = _payload3.id;
          // use modelName and id to delete model

          console.log('DELETE SELF', _modelName2, _id2);
          return state;
        }
      case Actions.DELETE_WARNING:
        {
          var _payload4 = { ...payload },
              _modelName3 = _payload4.modelName,
              _id3 = _payload4.id,
              rawDataList = _payload4.rawDataList;
          // fetch models that will be deleted if model is deleted

          console.log('DELETE WARNING', _modelName3, _id3);

          // note: raw data must have '__typename' in delete query. otherwise
          // delete warning table will not display correctly

          // group data into an array of arrays. each sub- array
          // holds model objects with name, __typename, & id attributes
          var groupedData = groupModels(rawDataList, '__typename');

          // add to store
          return { ...state, Delete: groupedData };
        }
      case Actions.CANCEL_DELETE:
        {
          // delete warning data from store
          return { ...state, Delete: [] };
        }
      default:
        return state;
    }
  };
};

var selectModal = exports.selectModal = function selectModal(state) {
  return R.prop('modal', state);
};