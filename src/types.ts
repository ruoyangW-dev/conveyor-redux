import { ActionsObservable } from 'redux-observable'
import { Action } from './actions'

export type QueryType =
  | 'index'
  | 'detail'
  | 'select'
  | 'tooltip'
  | 'search'
  | 'deleteCascades'
  | 'selectExistingFields'
  | 'create'
  | 'update'
  | 'delete'

export interface QueryTool {
  buildQuery({
    modelName,
    fieldName,
    queryType
  }: {
    modelName?: string
    fieldName?: string
    queryType: QueryType
  }): string

  sendRequest({
    query,
    variables,
    formData
  }: {
    query?: string
    variables?: object
    formData?: any
  }): Promise<
    | {
        data: unknown
        error: boolean
      }
    | {
        data: null
        error: unknown
      }
  >

  buildAndSendRequest({
    modelName,
    fieldName,
    variables,
    queryType
  }: {
    modelName?: string
    fieldName?: string
    variables: object
    queryType: QueryType
  }): Promise<
    | {
        data: unknown
        error: boolean
      }
    | {
        data: null
        error: unknown
      }
  >
}

export type ROEpic = <T extends unknown>(
  action$: ActionsObservable<Action<T>>,
  state$: any
) => any

export interface EpicPayload {
  modelName?: string
  fieldName?: string
  id?: string
  parentModelName?: string
  parentId?: string
  changedFields?: any
  removedId?: string
  queryString?: string
  queryText?: string
  expiresOn?: number
}

export interface RequestError {
  response: {
    errors: [ErrorItem]
  }
}

export const isRequestError = (
  error: unknown | undefined
): error is RequestError => {
  return (error as RequestError)?.response !== undefined
}

export interface ErrorItem {
  message: string
}

export interface Config {
  [key: string]: any
}
