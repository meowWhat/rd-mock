import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { getRoutes } from './router'
import { schema } from './types'
import { INTERFACE_ADDRESS_INVALID } from './result'

const app = new Koa()

app.use(bodyParser())

app.use(async (ctx, next) => {
  //SET  CORS
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200
  }
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE',
    'Access-Control-Allow-Credentials': 'true',
  })
  ctx.body = {}
  await next()
})

//处理无效请求地址
app.use(async (ctx, next) => {
  ctx.body = {
    code: INTERFACE_ADDRESS_INVALID.code,
    message: INTERFACE_ADDRESS_INVALID.message,
    data: null,
  }
  await next()
})

//生成  路由  + mock
const rdMock = (schema: schema, port = 3000, delay = 0) => {
  app.use(async (ctx, next) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, delay)
    })
    ctx.body = {}
    await next()
  })

  app.use(getRoutes(schema))

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`)
  })
}

export { rdMock }
