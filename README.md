# conveyor-redux

[![npm version](https://badge.fury.io/js/%40autoinvent%2Fconveyor-redux.svg)](https://badge.fury.io/js/%40autoinvent%2Fconveyor-redux)
![CI](https://github.com/autoinvent/conveyor-redux/workflows/CI/badge.svg?branch=main)
![license](https://img.shields.io/github/license/autoinvent/conveyor-redux)

A JavaScript Redux implementation of the state and actions needed by [conveyor](https://github.com/autoinvent/conveyor)

## Docs

[View the docs here](https://autoinvent.github.io/conveyor-redux/)

## Installation

With yarn:
```bash
yarn add @autoinvent/conveyor-redux
```

With npm:

```bash
npm install --save @autoinvent/conveyor-redux
```

## Usage:

To generate the reducer to be used by conveyor:

- **Note: The key MUST be `conveyor`.**

```javascript
import { ConveyorReducer } from 'conveyor-redux'

const rootReducer = combineReducers({
  conveyor: new ConveyorReducer(schema, overrides, config).makeReducer(),
  ...otherReducers
})
```

Where `schema` is the same schema used for conveyor (a 'SchemaBuilder' type object created with conveyor-schema), [`overrides`](#reducer-overrides) is an map object which maps a reducer (key) to a class (value), and `config` is a user-defined object for customization.

To generate the epic to be used by conveyor:

```javascript
const conveyorEpic = new ConveyorEpic(schema, queryTool, config).makeEpic(store)
```

Where `schema` is the same schema used for conveyor (a 'SchemaBuilder' type object created with conveyor-schema), `queryTool` is a 'QueryTool' type object created with [magql-query](https://github.com/autoinvent/magql-query), and `config` is a user-defined object for customization.

**Note**: Schema functions that normally receive `customProps` (getDisplayValue, etc.), which are used by the [library](https://github.com/autoinvent/conveyor-schema), are NOT going to be received by the Reducers.

### Reducer Overrides

The option overrides parameter is provided to ConveyorReducer constructor, and should have the following format

```
{
  REDUCER_KEY: REDUCER_CLASS or falsy value
}
```

The list of possible reducers that can be modified are: `alerts`, `create`, `edit`, `index`, `modal`, `model`, `options`, `search`, `userPreferences`, `tableView`, and `tooltip`. (REDUCER_KEY)

The REDUCER_CLASS can be a new reducer class or reducer class which extends a reducer provided by conveyor-redux. If it is a falsy value, the reducer will be disabled.

For example the following custom reducer adds a console log to the UPDATE_MODEL_TOOLTIP action response:

```javascript
import { UPDATE_MODEL_TOOLTIP } from 'conveyor-redux/lib/actionConsts'

class CustomTooltipReducer extends TooltipReducer {
  [UPDATE_MODEL_TOOLTIP](state, action) {
    console.log('Updating Tooltip')
    return super[UPDATE_MODEL_TOOLTIP](state, action)
  }
}
```

Note: beware that your custom classes cannot be written using ES6 and interact with (transpiled) ES5 classes without creating an error.
If you are using ES6 for your classes, then you must use redux-thunk to manipulate the redux store in overrides.

https://stackoverflow.com/questions/51860043/javascript-es6-typeerror-class-constructor-client-cannot-be-invoked-without-ne/51860850

This overrides object with this reducer would look like:

```javascript
{
  tooltip: CustomTooltipReducer
}
```

### Special Features

Conveyor-Redux handles the special features below:

#### Pagination
The amount of table content that is displayed can be divided through pagination if `paginate` is set to true in [Schema](https://github.com/autoinvent/conveyor-schema) (`paginate` is true by default). The default amount of data displayed per a page is 20, but can be modified by passing in a [`config`](#config) when instantiating the Conveyor Reducer and Epic.

#### Sorting
Table data can be sorted by a field's increasing or decreasing order if `sortable` is set to true in [Schema](https://github.com/autoinvent/conveyor-schema) (`sortable` is true by default). Sorting is toggleable by clicking the Table Header of a column Field. Sort order iterates over 'No Order ↕ -> Ascending Order ⬆ -> Descending Order ⬇'. 

#### Filtering
Table data can be filtered by one or more filter rules set by the user if `filterable` is true in [Schema](https://github.com/autoinvent/conveyor-schema) (`filterable` is true by default). Number of filter options are available depending on the field type (string, integer, date, etc.)

### Config

The config parameter is provided to ConveyorEpic and ConveyorReducer constructors. 

For example, the following config option changes the amount of data displayed per a page on a table.

```javascript
const config = {
  tableView: {
    defaultPerPage: 10  // Displays only 10 rows on a table per page
  }
}
// Pass to ConveyorReducer
ConveyorReducer(schema, overrides, config)
// Pass to ConveyorEpic
ConveyorEpic(schema, queryTool, config)
```

### Redux structure
At the bottom is the default redux store structure (assuming no Reducers are overriden).
`router` holds data for when handling actions from [react-router](https://reactrouter.com/) while `conveyor` holds data for use with [conveyor](https://github.com/autoinvent/conveyor). Custom data can also be updated or added to the store through overrides.
For example, the code below will add a new object called `customQuery` to the store and have a value of {someResult: "...Loading..."} in state:
```javascript
export const customQuery = (state = initState, action) => {
  const payload = action.payload

  switch (action.type) {
    case (constants.CUSTOM_QUERY) : {
      return { "someResult": "...Loading" }
    }
    default:
      return state
  }
}
```

```
router
| action
| location
| | pathname
| | search
| | hash
| | key
| | query
conveyor
| alerts
| create
| | index
| | stack
| | originPath
| edit
| | modelName
| | | id
| | | | fieldName
| modal
| | modelName
| | | order
| | | values
| | Delete
| | | index
| model
| | modelName
| | | order
| | | values
| options
| | modelName
| | | fieldName
| | | | index
| tooltip
| | modelName
| | | id
| tableView
| | modelName
| | | page
| | | fields
| | | | fieldName
| | | | | page
| search
| | queryText
| | entries
| | dropdown
| userPreferences
| | darkMode
customQuery (If added)
```