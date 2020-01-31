import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import * as R from 'ramda';
import * as Actions from '../actions';
import * as consts from '../actionConsts';
export var generateIndexTableFilterChangeEpic = function generateIndexTableFilterChangeEpic() {
  return function (action$) {
    return action$.pipe(ofType(consts.INDEX_TABLE_FILTER_SUBMIT), map(R.path(['payload', 'modelName'])), map(function (modelName) {
      return Actions.fetchModelIndex({
        modelName: modelName
      });
    }));
  };
};
export var generateIndexTableSortChangeEpic = function generateIndexTableSortChangeEpic() {
  return function (action$) {
    return action$.pipe(ofType(consts.INDEX_TABLE_SORT_CHANGE), map(R.path(['payload', 'modelName'])), map(function (modelName) {
      return Actions.fetchModelIndex({
        modelName: modelName
      });
    }));
  };
};