import Router from 'koa-router'
import { schema } from './types'
import DB from './db/initDB'
import { Get, Put, Delete, Post } from './serve'

const router = new Router()

export const getRoutes = (schema: schema) => {
  //初始化 数据库 , 拿到schema 的keys数组
  const { db, keys } = DB(schema)

  //遍历数组 生成路由
  keys.forEach((key) => {
    //增
    Post(db, key, router)

    //删
    Delete(db, key, router)

    //改
    Put(db, key, router)

    //查
    Get(db, key, router)
  })

  return router.routes()
}
