# Epics

## Generating epics

When generating epics the `combineEpics` call is not catching errors. When you combine Conveyor epics with any other epics you may be using, you will need to catch errors using a function like the one in this [issue on the redux-observable GitHub](https://github.com/redux-observable/redux-observable/issues/94#issuecomment-396763936) to make sure you are properly handling errors.

## Using epics

### `fetchModelIndexEpic`

When generating the `fetchModelIndexEpic`, you need to supply a schema which consists of your models and follows [Conveyor's schema pattern](> TODO: insert the link to the schema portion of Conveyor's docs. >) as well as a function that makes a requests and returns a Promise.
