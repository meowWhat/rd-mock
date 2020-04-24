import { dbType, router } from '../types'
import { getSendData } from '../utils'
import { SUCCESS, RESULE_DATA_NONE, PARAM_IS_BLANK } from '../result'

export default (db: dbType, key: string, router: router) => {
  //delete  删
  router.delete(`/${key}`, (ctx, next) => {
    //做删除处理 并响应结果
    let condition = ctx.request.body
    if (condition) {
      //如果有body
      let res = (db.get(key) as any).find(condition).value()
      if (res) {
        //查询到结果 =>remove

        ;(db.get(key) as any).remove(condition).write()

        ctx.body = getSendData(SUCCESS, res)
      } else {
        //否则 查询数据失败
        ctx.body = getSendData(RESULE_DATA_NONE, null)
      }
    } else {
      ctx.body = getSendData(PARAM_IS_BLANK, null)
    }
    next()
  })
}
