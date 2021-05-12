export type QueryType =
  | 'index'
  | 'detail'
  | 'select'
  | 'tooltip'
  | 'indexRelationship'
  | 'detailRelationship'
  | 'selectRelationship'
  | 'search'
  | 'create'
  | 'update'
  | 'delete'
  | 'deleteCascades'
  | 'selectExistingFields'

export interface QueryBuilder {
  buildQuery({
    modelName,
    fieldName,
    queryType
  }: {
    modelName?: string
    fieldName?: string
    queryType: QueryType
  }): any
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
        data: any
        error: boolean
      }
    | {
        data: null
        error: any
      }
  >
  buildAndSendRequest({
    modelName,
    variables,
    queryType
  }: {
    modelName: string
    variables: object
    queryType: QueryType
  }): Promise<
    | {
        data: any
        error: boolean
      }
    | {
        data: null
        error: any
      }
  >
}

export type ROEpic = (action$: any, state$: any) => any

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
