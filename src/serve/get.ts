import _ from 'lodash'
import { dbType, router } from '../types'
import { getSendData, _parseInt, isArr, isObj } from '../utils'
import { SUCCESS, RESULE_DATA_NONE } from '../result'
import {
  parsePaginate,
  parseSort,
  parseSlice,
  parseOperators,
} from '../parseUrl'

export default (db: dbType, key: string, router: router) => {
  router.get(`/${key}`, (ctx, next) => {
    let data: string[] = db.get(key).value()

    //无参数 或者data 不是数组类型 直接发送数据 , -- 因为路由生成依靠与 data 所以 不需要判断data
    if (ctx.querystring === '' || !isArr(data)) {
      ctx.body = getSendData(SUCCESS, data)
      return next()
    }

    let query = ctx.query

    //参数处理
    const { page } = parsePaginate(query)
    const { sortKey, orderKey } = parseSort(query)
    const { start, end, limit } = parseSlice(query)
    const operatorsObj = parseOperators(query)

    //数据查询

    //分析管道
    // getAllbyReqUrl => queryConditon => Operators  => Slice => Paginate  => Sort

    //queryConditon

    if (isObj(query)) {
      if (query['id']) {
        query['id'] = _parseInt(query['id'])
      }
      data = _.filter(data, query)
    }

    //Operators 操作符管道
    if (operatorsObj) {
      let fileds = Object.keys(operatorsObj)
      if (isArr(fileds)) {
        data = _.filter(data, (dataItem) =>
          fileds.every((name: any) =>
            operatorsObj[name].every(({ range, operators }) => {
              const compareData = _parseInt(dataItem[name])
              range = _parseInt(range)
              let res = false
              switch (operators) {
                case 'gte':
                  res = compareData > range
                  break
                case 'lte':
                  res = compareData < range
                  break
                case 'ne':
                  res =( compareData !== range)
                  break
                case 'like':
                  res = compareData.toString().includes(range.toString())
                  break
                case 'num':
                  res = compareData === range
              }
              return res
            })
          )
        )
      }
    }

    //slice   切割 管道
    if (start !== -1 && end !== -1) {
      data = _.slice(data, start, end)
    }

    //Paginate   分页管道

    data = _.slice(data, (page - 1) * limit, page * limit)

    //Sort   排序管道
    data = _.orderBy(data, sortKey, orderKey)

    // 发送
    if (isArr(data)) {
      ctx.body = getSendData(SUCCESS, data)
    } else {
      ctx.body = getSendData(RESULE_DATA_NONE, null)
    }

    next()
  })
}
