# conveyor-redux
![CI](https://github.com/autoinvent/conveyor-redux/workflows/CI/badge.svg)

A JavaScript Redux implementation of the state and actions needed by [conveyor](https://github.com/autoinvent/conveyor)

## Usage:
1. Install conveyor-redux (through `npm` or `yarn`)
2. To generate the reducer to be used by conveyor:
* **Note: The key MUST be `conveyor`.**
```javascript
import { ConveyorReducer } from 'conveyor-redux'

const rootReducer = combineReducers({ 
  conveyor: new ConveyorReducer(schema, overrides).makeReducer(), ...otherReducers 
})
```
Where `schema` is the same schema used for conveyor (a 'SchemaBuilder' type object created with conveyor-schema), and [`overrides`](#reducer-overrides) is an map object which maps a reducer (key) to a class (value).


### Reducer Overrides
The option overrides parameter is provided to ConveyorReducer constructor, and should have the following format
```
{
  REDUCER_KEY: REDUCER_CLASS or falsy value
}
```
The list of possible reducers that can be modified are: `alerts`, `create`, `darkMode`, `edit`, `index`, `modal`, `model`, `options`, `search`, `tableView`, and `tooltip`. (REDUCER_KEY)

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

### Development

to create '/lib' files with typescript run:

'tsc'

Before committing, in order to test the build files run:

'yarn build'

to test and fix eslint issues run:

'yarn eslint 'src/**/*.ts' --fix'

Before npm publishing please follow instructions in '/docs/npm_publish/publish.rst'
