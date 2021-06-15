import Router from 'koa-router'
import { schema } from './types'
import DB from './db/initDB'
import { Get, Put, Delete, Post } from './serve'

const router = new Router()

export const getRoutes = (schema: schema) => {
  //初始化 数据库 , 拿到schema 的keys数组
  const { db, keys } = DB(schema)

  router.get('/', (ctx, next) => {
    ctx.body = `
      <h1>Rd-Mock</h1>
      <h3>路由列表:</h3>
      <ul>
      ${keys
        .map((item) => {
          return `<li>/${item}</li>`
        })
        .join('')}
      </ul>`
    ctx.set({ 'Content-Type': 'text/html;charset=utf-8' })
    next()
  })

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
