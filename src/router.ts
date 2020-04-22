import Router from 'koa-router'

const router = new Router()

export type mockData = Array<Options>

interface Options {
  url: string
  res?: any
}
export const getRoutes = (mock: mockData) => {
  //处理mock
  return router.routes
}
