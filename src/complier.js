import * as Router from 'koa-router'
import * as Mock from 'mockjs'
const router = new Router()

//编译函数
const getRoutes = (template) => {
  if (Array.isArray(template)) {
    //template 为数组 遍历
    template.forEach((el) => {
      const { url, method, res, param } = el
      //注册路由 ,返回data
      router[method](url, (ctx, next) => {
        if (param) {
          //接受参数 返回 函数执行结果
          ctx.body = param(ctx.request.body, ctx.query)
        } else {
          ctx.body = res
        }
        //注入mock
        ctx.body = Mock.mock(ctx.body)
        next()
      })
    })
    return router.routes()
  }
}

export { getRoutes }
