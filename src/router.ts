import Router from 'koa-router'
import { schema } from './types'
import DB from './db/initDB'

import {
  matchOperators,
  query,
  getOperators,
  _parseInt,
  filterDependOnOperators,
  getSendData,
} from './utils'

import {
  SUCCESS,
  RESULE_DATA_NONE,
  PARAM_IS_BLANK,
  DATA_ALREADY_EXISTED,
} from './result'

const router = new Router()

export const getRoutes = (schema: schema) => {
  //初始化 数据库 , 拿到schema 的keys数组
  const { db, keys } = DB(schema)
  //遍历数组 生成路由
  keys.forEach((key) => {
    //get 查
    router.get(`/${key}`, (ctx, next) => {
      if (ctx.querystring !== '') {
        /*  初始化阶段 */

        const query: query = ctx.query
        let sortKey: string[] = ['id']
        let sortMehod: string[] = ['asc']

        if (query['id'] !== undefined) {
          //将id 转换为number类型
          query['id'] = _parseInt(query['id'])
        }

        if (query['_sort'] !== undefined) {
          //如果设置 sort 字段覆盖初始的 id
          sortKey[0] = query['_sort'].toString().toLowerCase()

          delete query['_sort']
        }
        if (query['_order'] !== undefined) {
          //如果设置 order 字段覆盖初始的  asc
          sortKey[0] = query['_order'].toString().toLowerCase()
          delete query['_order']
        }

        //筛选操作符 get lte ,决定是否需要筛选
        const res = matchOperators(query)

        /*  分页查询 */
        if (query['_limit'] !== undefined) {
          //转换成数字
          let page = 1
          if (query['_page'] !== undefined) {
            page = _parseInt(query['_page'])
            delete query['_page']
          }
          const limit = _parseInt(query['_limit'])
          delete query['_limit']
          //res为数组长度大于0 => 走 筛选 + 分页
          if (Array.isArray(res) && res.length > 0) {
            //解析操作符数组 , 获得好用得格式
            //将 name_gte=20 解析为 temp 形式
            const temp = getOperators(res, query)
            //查询 slowdb
            let data = (db.get(key) as any)
              .filter((el: any) => {
                //分页 +  操作符 过滤
                if (el['id'] > (page - 1) * limit) {
                  return filterDependOnOperators(temp, el)
                }
                return false
              })
              .orderBy(sortKey)
              .take(limit)
              .value()

            if (data) {
              ctx.body = getSendData(SUCCESS, data)
            } else {
              ctx.body = getSendData(RESULE_DATA_NONE, null)
            }
            // 停止逻辑 继续
            return
          }

          //只有分页逻辑
          const data = (db.get(key) as any)
            .filter((el: any) => el['id'] > (page - 1) * limit)
            .orderBy(sortKey, sortMehod)
            .take(limit)
            .value()
          if (data) {
            ctx.body = getSendData(SUCCESS, data)
          } else {
            ctx.body = getSendData(RESULE_DATA_NONE, null)
          }
          return
        }

        /*  含操作符条件查询,无分页  ---重复代码 待抽取 --- 考虑中*/

        if (Array.isArray(res) && res.length > 0) {
          //解析操作符数组 , 获得好用得格式
          //将 name_gte=20 解析为 temp 形式
          const temp = getOperators(res, query)
          //查询 slowdb
          let data = (db.get(key) as any)
            .filter((el: any) => filterDependOnOperators(temp, el))
            .orderBy(sortKey, sortMehod)
            .value()

          if (data) {
            ctx.body = getSendData(SUCCESS, data)
          } else {
            ctx.body = getSendData(RESULE_DATA_NONE, null)
          }
          // 停止逻辑 继续
          return
        }

        /*  无操作符条件查询  

          string !== number 

        */
        const data = (db.get(key) as any).find(query).value()

        if (data) {
          //查询成功
          ctx.body = getSendData(SUCCESS, data)
        } else {
          //查询失败
          ctx.body = getSendData(RESULE_DATA_NONE, null)
        }
      } else {
        //无参数 查询所有返回
        ctx.body = getSendData(SUCCESS, db.get(key).value())
      }

      next()
    })

    //delete  删
    router.delete(`/${key}`, (ctx, next) => {
      //做删除处理 并响应结果
      let condition = ctx.request.body
      if (condition) {
        //如果有body
        let res = (db.get(key) as any).find(condition).value()
        if (res) {
          //查询到结果 =>remove
          ;(db.get(key) as any).remove(condition).write()
          ctx.body = {
            code: SUCCESS.code,
            message: SUCCESS.message + 'delete',
            data: res,
          }
        } else {
          //否则 查询数据失败
          ctx.body = {
            code: RESULE_DATA_NONE.code,
            message: RESULE_DATA_NONE.message,
            data: null,
          }
        }
      } else {
        ctx.body = {
          code: PARAM_IS_BLANK.code,
          message: PARAM_IS_BLANK.message,
          data: null,
        }
      }
      next()
    })

    //post  增
    router.post(`/${key}`, (ctx, next) => {
      //做添加处理
      let condition = ctx.request.body
      if (condition && condition.id !== undefined) {
        //如果有body
        let res = (db.get(key) as any).find({ id: condition.id }).value()
        if (res) {
          //查询到结果 => 值已存在 返回存在的值
          ctx.body = {
            code: DATA_ALREADY_EXISTED.code,
            message: DATA_ALREADY_EXISTED.message,
            data: res,
          }
        } else {
          //否则查询添加数据
          ;(db.get(key) as any).push(condition).write()
          ctx.body = {
            code: SUCCESS.code,
            message: SUCCESS.message + 'post',
            data: condition,
          }
        }
      } else {
        ctx.body = {
          code: PARAM_IS_BLANK.code,
          message: PARAM_IS_BLANK.message,
          data: null,
        }
      }
      next()
    })

    //put  改
    router.put(`/${key}`, (ctx, next) => {
      //做update处理
      let condition = ctx.request.body
      if (condition && condition.id !== undefined) {
        //如果有body 并且有id
        let res = (db.get(key) as any).find({ id: condition.id }).value()
        if (res) {
          //查询到结果 => 更新数据
          ;(db.get(key) as any)
            .find({ id: condition.id })
            .assign(condition)
            .write()
          ctx.body = {
            code: SUCCESS.code,
            message: SUCCESS.message + 'put',
            data: null,
          }
        } else {
          //数据未找到 无法修改
          ctx.body = {
            code: RESULE_DATA_NONE.code,
            message: RESULE_DATA_NONE.message,
            data: null,
          }
        }
      } else {
        ctx.body = {
          code: PARAM_IS_BLANK.code,
          message: PARAM_IS_BLANK.message,
          data: null,
        }
      }
      next()
    })
  })

  return router.routes()
}
