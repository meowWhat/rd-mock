import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { getRoutes } from './router'
import { schema } from './types'
import { INTERFACE_ADDRESS_INVALID } from './result'

const app = new Koa()

app.use(bodyParser())

app.use((ctx, next) => {
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
  next()
})

//处理无效请求地址
app.use((ctx, next) => {
  ctx.body = {
    code: INTERFACE_ADDRESS_INVALID.code,
    message: INTERFACE_ADDRESS_INVALID.message,
    data: null,
  }
  next()
})

//生成  路由  + mock
const rdMock = (schema: schema, port = 3000) => {
  app.use(getRoutes(schema))

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`)
  })
}

export { rdMock }
