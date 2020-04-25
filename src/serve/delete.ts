import { dbType, router } from '../types'
import { getSendData, isObj, isArr } from '../utils'
import { SUCCESS, RESULE_DATA_NONE, PARAM_IS_BLANK } from '../result'

export default (db: dbType, key: string, router: router) => {
  //delete  删
  router.delete(`/${key}`, (ctx, next) => {
    //做删除处理 并响应结果
    let condition = ctx.request.body
    if (isObj(condition)) {
      let data = db.get(key).value()
      if (isObj(data)) {
        const flag = Object.keys(condition).every(
          (key) => data[key] === condition[key]
        )
        if (flag) {
          db.unset(key).write()
          ctx.body = getSendData(SUCCESS, null)
        } else {
          ctx.body = getSendData(RESULE_DATA_NONE, null)
        }
      } else if (isArr(data)) {
        let res = (db.get(key) as any).find(condition).value()
        if (res) {
          //查询到结果 =>remove
          ;(db.get(key) as any).remove(condition).write()
          ctx.body = getSendData(SUCCESS, null)
        } else {
          //否则 查询数据失败
          ctx.body = getSendData(RESULE_DATA_NONE, null)
        }
      } else {
        ctx.body = getSendData(RESULE_DATA_NONE, null)
      }
    } else {
      ctx.body = getSendData(PARAM_IS_BLANK, null)
    }
    next()
  })
}
