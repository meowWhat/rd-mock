/**
 * @type {import('../lib/types/index')}
 */
const { rdMock } = require('../lib/index')

// use `mockjs` schema  to create rd-mock data
// rd-mock require filed 'id' in schema
const schema = {
  'a|5': [
    {
      'id|+1': 1,
      'money|1-400': 1,
      name: '@cname',
      address: `@city(true)`,
      email: `@email`,
    },
  ],
}

// Start  rd-mock  on port 3000
rdMock(schema, {
  port: 3000,
  delay: 0,
  responseInterceptors: [
    async (ctx, next) => {
      if (ctx.request.method === 'GET' && ctx.request.url === 'a') {
        const { data } = ctx.body
        ctx.body.data = {
          count: 400,
          list: data,
        }
      }
      await next()
    },
  ],
  requestInterceptors: [
    async (ctx, next) => {
      const query = ctx.query
      if (query['page']) {
        query['_page'] = query['page']
        delete query['page']
      }
      if (query['pageSize']) {
        query['_limit'] = query['pageSize']
        delete query['pageSize']
      }
      await next()
    },
  ],
})
