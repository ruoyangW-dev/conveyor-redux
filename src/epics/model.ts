import * as Actions from '../actions'
import {
  FETCH_MODEL_INDEX,
  FETCH_MODEL_DETAIL,
  REQUEST_DELETE_MODEL,
  REQUEST_DELETE_REL_TABLE_MODEL,
  REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE,
  CHANGE_PAGE
} from '../actionConsts'
import * as R from 'ramda'
import { getFilters, getSort, getPage, getDeleteErrors } from '../utils/helpers'
import { map, mergeMap, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { selectTableView } from '../utils/tableView'
import { concat } from 'rxjs'
import * as Logger from '../utils/Logger'
import { Epic } from './epic'
import { EpicPayload } from '../types'
import { DEFAULT_PAGINATION_AMT } from '../utils/tableView'

/**
 * A class containing epics handling model actions
 */
export class ModelEpic extends Epic {
  /**
   * Dispatched by [indexEditSubmitCheck](./validationepic.html#index_edit_submit_check), 
   * [indexTableFilterSubmit](./indextableepic.html#index_table_filter_submit), and 
   * [indexTableSortChange](./indextableepic.html#index_table_sort_change)
   * @param action$ object {type: string, payload: {modelName: string}}
   * @param state$ Redux state
   * @returns - Actions.[updateModelIndex](./modelreducer.html#update_model_index)({modelName: string, data: object})
   */
  [FETCH_MODEL_INDEX](action$: any, state$: any) {
    const defaultPerPage =
      this.config.tableView?.defaultPerPage ?? DEFAULT_PAGINATION_AMT
    return action$.pipe(
      ofType(FETCH_MODEL_INDEX, CHANGE_PAGE),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const variables = {
          filter: getFilters({
            schema: this.schema,
            modelName: payload.modelName as string,
            tableView: selectTableView(state$.value)
          }),
          sort: getSort({
            schema: this.schema,
            modelName: payload.modelName as string,
            tableView: selectTableView(state$.value)
          }),
          page: getPage({
            modelName: payload.modelName as string,
            tableView: selectTableView(state$.value),
            defaultPerPage: defaultPerPage
          })
        }
        const model = this.schema.getModel(payload.modelName as string)
        const paginate = R.propOr(true, 'paginate', model)
        if (paginate === false)
          return {
            modelName: payload.modelName,
            variables: R.omit(['page'], variables)
          }
        return { modelName: payload.modelName, variables }
      }),
      mergeMap((context: any) => {
        const query = this.queryTool.buildQuery({
          modelName: context.modelName,
          queryType: 'index'
        })
        return this.queryTool
          .sendRequest({ query, variables: context.variables })
          .then(({ data, error }) => ({ context, data, error }))
      }),
      map(
        ({ context, data, error }: { context: any; data: any; error: any }) => {
          if (error) {
            return Actions.addDangerAlert({
              message: `Error loading ${context.modelName} index.`
            })
          }
          return Actions.updateModelIndex({
            modelName: context.modelName,
            data
          })
        }
      )
    )
  }

  /**
   * Called when loading the Detail page of a model instance.
   * @param action$ object {type: string, payload: {modelName: string, id: string}}
   * @returns - Actions.[updateModelDetail](./modelreducer.html#update_model_detail)({modelName: string, id: string, data: object})
   */
  [FETCH_MODEL_DETAIL](action$: any) {
    return action$.pipe(
      ofType(FETCH_MODEL_DETAIL),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const variables = { id: payload.id }
        return { modelName: payload.modelName, id: payload.id, variables }
      }),
      mergeMap((context: any) => {
        const query = this.queryTool.buildQuery({
          modelName: context.modelName,
          queryType: 'detail'
        })
        return this.queryTool
          .sendRequest({ query, variables: context.variables })
          .then(({ data, error }) => ({ context, data, error }))
      }),
      switchMap(({ context, data, error }): any => {
        if (error) {
          return concat([
            Actions.addDangerAlert({
              message: `Error loading ${context.modelName} details.`
            }),
            Actions.modelNotFound({
              modelName: context.modelName
            })
          ])
        }
        return concat([
          Actions.updateModelDetail({
            modelName: context.modelName,
            id: context.id,
            data
          })
        ])
      })
    )
  }

  /**
   * Dispatched when deleting a model instance on Index page.
   * @param action$ object {type: string, payload: {modelName: string, id: string}}
   * @returns - \[ \
   *  Actions.[updateDeleteModel](./modelreducer.html#update_delete_model)({modelName: string, id: string}), \
   *  Actions.[addSuccessAlert](./alertepic.html#add_success_alert)({message: string}) \
   * ]
   */
  [REQUEST_DELETE_MODEL](action$: any) {
    return action$.pipe(
      ofType(REQUEST_DELETE_MODEL),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const query = this.queryTool.buildQuery({
          modelName: payload.modelName,
          queryType: 'delete'
        })
        const variables = { id: payload.id }
        return {
          modelName: payload.modelName,
          id: payload.id,
          query,
          variables
        }
      }),
      mergeMap((context: any) =>
        this.queryTool
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      switchMap(({ context, data, error }) => {
        // todo: pass 'node' and 'data' props
        // @ts-ignore
        const displayName = this.schema.getModelLabel({
          modelName: context.modelName
        })

        // get errors from context
        const errors = getDeleteErrors({ data, context })
        if (errors) {
          Logger.epicError('requestDeleteModelEpic', context, error)
          const contactErrors = R.join('. ', errors)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}. ${contactErrors}`
            })
          ])
        }

        // get errors from 'error' prop
        if (error) {
          Logger.epicError('requestDeleteModelEpic', context, error)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}.`
            })
          ])
        }

        return concat([
          Actions.updateDeleteModel({
            modelName: context.modelName,
            id: context.id
          }),
          Actions.addSuccessAlert({
            message: `${displayName} was successfully deleted.`
          })
        ])
      })
    )
  }

  /**
   * Dispatched when deleting a relation field in the Detail page.
   * @param action$ object {type: string, payload: {id: string, parentModel: string, parentId: string, modelName: string}}
   * @returns - \[ \
   *  Actions.[fetchModelDetail](./modelepic.html#fetch_model_detail)({modelName: string, id: string}), \
   *  Actions.[addSuccessAlert](./alertepic.html#add_success_alert)({message: string}) \
   * ]
   */
  [REQUEST_DELETE_REL_TABLE_MODEL](action$: any) {
    return action$.pipe(
      ofType(REQUEST_DELETE_REL_TABLE_MODEL),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const query = this.queryTool.buildQuery({
          modelName: payload.modelName,
          queryType: 'delete'
        })
        const variables = { id: payload.id }
        return { ...payload, query, variables }
      }),
      mergeMap((context: any) =>
        this.queryTool
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      switchMap(({ context, data, error }) => {
        // todo: pass node and data props in
        // @ts-ignore
        const displayName = this.schema.getModelLabel({
          modelName: context.modelName
        })

        // get errors from context
        const errors = getDeleteErrors({ data, context })
        if (errors) {
          Logger.epicError('requestDeleteModelEpic', context, error)
          const contactErrors = R.join('. ', errors)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}. ${contactErrors}`
            })
          ])
        }

        if (error) {
          Logger.epicError('requestDeleteRelTableModelEpic', context, error)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}.`
            })
          ])
        }

        return concat([
          Actions.fetchModelDetail({
            modelName: context.parentModel,
            id: context.parentId
          }),
          Actions.addSuccessAlert({
            message: `${displayName} was successfully deleted.`
          })
        ])
      })
    )
  }

  /**
   * Dispatched when deleting a model instance from Detail page.
   * @param action$ object {type: string, payload: {id: string, modelName: string}}
   * @returns - \[ \
   *  Actions.[removeInstance](./modelreducer.html#remove_instance)({modelName: string, id: string}), \
   *  Actions.[addSuccessAlert](./alertepic.html#add_alert)({message: string}) \
   * ]
   */
  [REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE](action$: any) {
    return action$.pipe(
      ofType(REQUEST_DELETE_MODEL_FROM_DETAIL_PAGE),
      map(R.prop('payload')),
      map((payload: EpicPayload) => {
        const query = this.queryTool.buildQuery({
          modelName: payload.modelName,
          queryType: 'delete'
        })
        const variables = { id: payload.id }
        return {
          modelName: payload.modelName,
          id: payload.id,
          query,
          variables
        }
      }),
      mergeMap((context: any) =>
        this.queryTool
          .sendRequest({
            query: context.query,
            variables: context.variables
          })
          .then(({ data, error }) => ({ context, data, error }))
      ),
      switchMap(({ context, data, error }) => {
        // todo: pass node and data props in
        // @ts-ignore
        const displayName = this.schema.getModelLabel({
          modelName: context.modelName
        })

        // get errors from context
        const errors = getDeleteErrors({ data, context })
        if (errors) {
          Logger.epicError('requestDeleteModelEpic', context, error)
          const contactErrors = R.join('. ', errors)
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}. ${contactErrors}`
            })
          ])
        }

        if (error) {
          Logger.epicError(
            'requestDeleteModelFromDetailPageEpic',
            context,
            error
          )
          return concat([
            Actions.addDangerAlert({
              message: `Error deleting ${displayName}.`
            })
          ])
        }

        return concat([
          Actions.removeInstance({
            modelName: context.modelName,
            id: context.id
          }),
          Actions.addSuccessAlert({
            message: `${displayName} was successfully deleted.`
          })
        ])
      })
    )
  }
}
