import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { mockData, getRoutes } from './router'

const app = new Koa()

app.use(bodyParser())

app.use((ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200
  }

  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Token,Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE',
    'Access-Control-Allow-Credentials': 'true',
  })

  next()
})

const rdMock = (mockData: mockData, port = 5111) => {
  app.use(getRoutes(mockData))

  app.listen(port, () => {
    console.log(`Project is running at http://localhost:${port}/`)
  })
}

export { rdMock }
