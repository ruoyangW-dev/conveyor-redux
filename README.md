# conveyor-redux
A JavaScript Redux implementation of the state and actions needed by [conveyor](https://github.com/autoinvent/conveyor)

## Usage:
1. Install conveyor-redux (through `npm` or `yarn`)
2. To generate the reducers to be used by conveyor: 
```javascript
import { generateConveyorReducers } from 'conveyor-redux'

const rootReducer = combineReducers({ 
  ...generateConveyorReducers({ schema, customReducers }), ...otherReducers 
})
```
Where `schema` is the same schema used for conveyor, and [`customReducers`](#customreducers) is an object containing action overrides and/or additions to the generated conveyor-redux reducers.


### customReducers
customReducers is an optional parameter provided to generateConveyorReducers which should have the following format
```
{
  REDUCER_TO_MODIFY: {
    ACTION_TO_OVERRIDE/NEW_ACTION: function or false // a value of false disables the action for this reducer
  } or false // a value of false disables the reducer
}
```
The list of possible reducers that can be modified are: `alerts`, `create`, `edit`, `index`, `modal`, `model`, `options`, `search`, `tableView`, and `tooltip`.

For example, the following customReducers object would do the following:
* Disable the search reducer 
* Override the ADD_DANGER_ALERT action response in the alerts reducer
* Modify the tooltip reducer to respond to a new action and disable the UPDATE_MODEL_TOOLTIP action response

```javascript
import * as ActionTypes from 'conveyor-redux/lib/actionConsts'

const tooltipErrorReducer = (state, action) => {
  console.warn('A ${action.payload} error occurred with state ${state}')
  return [] // new state
}

const addDangerAlertReducer = (state, action) => {
  console.log('${action.payload}')
  return [] // new state
}

const customReducers = {
  search: false,
  alerts: {
    [ActionTypes.ADD_DANGER_ALERT]: addDangerAlertReducer // overriden action response
  },
  tooltip: {
    [ActionTypes.UPDATE_MODEL_TOOLTIP]: false, // disabled action response
    ['TOOLTIP_ERROR']: tooltipErrorReducer // new action response 
  }
}
```
Note that the functions provided receive both the state and and the action as arguments as well as return the new state (just like a typical reducer)!