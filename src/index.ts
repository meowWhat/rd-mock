import Koa, { Middleware } from 'koa'
import bodyParser from 'koa-bodyparser'
import { getRoutes } from './router'
import { schema } from './types'
import { INTERFACE_ADDRESS_INVALID } from './result'
import 'colors'
import os from 'os'
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

  // 应用响应拦截器
  if (responseInterceptors) {
    responseInterceptors.forEach((middleWare) => {
      app.use(middleWare)
    })
  }

  app.listen(port, () => {
    const ipList: string[] = []
    const ifaces = os.networkInterfaces()
    Object.keys(ifaces).forEach(function (ifname) {
      ifaces[ifname]?.forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return
        }
        ipList.push(iface.address)
      })
    })
    console.log(
      ` DONE `.bgGreen.black + ' ' + 'Compiled successfully'.green,
      '\n'
    )
    console.log('  rd-mock running at:')
    console.log('  - LOCAL: ' + `http://localhost:${port}/`.cyan)
    console.log('  - NetWork: ' + `http://${ipList[0]}:${port}/`.cyan)
  })
}

export { rdMock }
