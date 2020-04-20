import * as Koa from 'koa'
import * as koaBody from 'koa-body-parser'

import { getRoutes } from './complier'
import { Random } from 'mockjs'

const app = new Koa()

app.use(koaBody())

app.use((ctx, next) => {
  //设置跨域
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200
  }
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Token,Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,PATCH',
    'Access-Control-Allow-Credentials': 'true',
  })

  next()
})

const rdMock = (mock, port = 5111) => {
  app.use(getRoutes(mock))
  app.listen(port, () => {
    console.log(`Project is running at http://localhost:${port}/`)
  })
}

export { rdMock, Random }
