import { dbType, router } from '../types'
import { getSendData } from '../utils'
import { SUCCESS, DATA_ALREADY_EXISTED, PARAM_IS_BLANK } from '../result'

export default (db: dbType, key: string, router: router) => {
  router.post(`/${key}`, (ctx, next) => {
    //做添加处理
    let condition = ctx.request.body

    if (condition && condition.id !== undefined) {
      //如果有body
      let res = (db.get(key) as any).find({ id: condition.id }).value()
      if (res) {
        //查询到结果 => 值已存在 返回存在的值
        ctx.body = getSendData(DATA_ALREADY_EXISTED, res)
      } else {
        //否则添加数据
        ;(db.get(key) as any).push(condition).write()
        ctx.body = getSendData(SUCCESS, condition)
      }
    } else {
      //必须要求携带body  => 不然无法知道添加什么
      ctx.body = getSendData(PARAM_IS_BLANK, null)
    }
    next()
  })
}
