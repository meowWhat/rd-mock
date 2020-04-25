import { dbType, router } from '../types'
import { getSendData, isArr, isObj } from '../utils'

import { SUCCESS, RESULE_DATA_NONE, PARAM_IS_INVALID } from '../result'

export default (db: dbType, key: string, router: router) => {
  //put  改
  router.put(`/${key}`, (ctx, next) => {
    //做update处理
    let condition = ctx.request.body
    if (condition && condition.id !== undefined) {
      //如果有body 并且有 id
      let data = db.get(key).value()
      if (isObj(data)) {
        ;(db.get(key) as any).assign(condition).write()
        ctx.body = getSendData(SUCCESS, null)
      } else if (isArr(data)) {
        //查询
        const tempData = (db.get(key) as any).find({ id: condition.id }).value()
        if (!isObj(tempData)) {
          ctx.body = getSendData(RESULE_DATA_NONE, null)
        } else {
          ;(db.get(key) as any)
            .find({ id: condition.id })
            .assign(condition)
            .write()
          ctx.body = getSendData(SUCCESS, null)
        }
      } else {
        ctx.body = getSendData(RESULE_DATA_NONE, null)
      }
    } else {
      ctx.body = getSendData(PARAM_IS_INVALID, null)
    }
    next()
  })
}
