import { dbType, router } from '../types'
import { getSendData } from '../utils'

import {
  SUCCESS,
  RESULE_DATA_NONE,
  PARAM_IS_BLANK,
  PARAM_IS_INVALID,
} from '../result'

export default (db: dbType, key: string, router: router) => {
  //put  改
  router.put(`/${key}`, (ctx, next) => {
    //做update处理
    let condition = ctx.request.body
    if (condition) {
      if (condition.id !== undefined) {
        //如果有body 并且有id
        let res = (db.get(key) as any).find({ id: condition.id }).value()
        if (res) {
          //查询到结果 => 更新数据
          ;(db.get(key) as any)
            .find({ id: condition.id })
            .assign(condition)
            .write()
          ctx.body = getSendData(SUCCESS, null)
        } else {
          //数据未找到 无法修改
          ctx.body = getSendData(RESULE_DATA_NONE, null)
        }
      } else {
        ctx.body = getSendData(PARAM_IS_INVALID, null)
      }
    } else {
      ctx.body = getSendData(PARAM_IS_BLANK, null)
    }
    next()
  })
}
