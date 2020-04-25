import { dbType, router } from '../types'
import { getSendData, isObj, isArr } from '../utils'
import {
  SUCCESS,
  DATA_ALREADY_EXISTED,
  PARAM_IS_INVALID,
  RESULE_DATA_NONE,
} from '../result'

export default (db: dbType, key: string, router: router) => {
  router.post(`/${key}`, (ctx, next) => {
    //做添加处理
    let condition = ctx.request.body
    if (isObj(condition) && condition.id !== undefined) {
      let data = db.get(key).value()
      if (isObj(data)) {
        const flag = Object.keys(condition).every(
          (key) => data[key] === condition[key]
        )
        if (flag) {
          ctx.body = getSendData(DATA_ALREADY_EXISTED, null)
        } else {
          const temp = []
          temp.push(data, condition)
          db.set(key, temp).write()
          ctx.body = getSendData(SUCCESS, null)
        }
      } else if (isArr(data)) {
        let res = (db.get(key) as any).find(condition).value()
        if (res) {
          //数据存在
          ctx.body = getSendData(DATA_ALREADY_EXISTED, null)
        } else {
          //添加数据
          ;(db.get(key) as any).push(condition).write()
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
