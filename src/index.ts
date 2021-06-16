import Koa, { Middleware } from 'koa'
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

interface ConfigOptions {
  // 接口延迟
  delay?: number
  // 端口号
  port?: number
  // 请求拦截器
  requestInterceptors?: Middleware[]
  // 响应拦截器
  responseInterceptors?: Middleware[]
}

//生成  路由  + mock
const rdMock = (schema: schema, config: ConfigOptions) => {
  const {
    delay = 0,
    port = 3000,
    requestInterceptors,
    responseInterceptors,
  } = config

  // 应用请求拦截器
  if (requestInterceptors) {
    requestInterceptors.forEach((middleWare) => {
      app.use(middleWare)
    })
  }

  // 执行 delay
  app.use(async (ctx, next) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, delay)
    })
    ctx.body = {}
    await next()
  })

  // 生成路由
  app.use(getRoutes(schema))

  // 生成响应拦截器
  if (responseInterceptors) {
    responseInterceptors.forEach((middleWare) => {
      app.use(middleWare)
    })
  }

  app.listen(port, () => {
    console.log(`服务器成功启动于:http://localhost:${port}/`)
  })
}

export { rdMock }
