import _ from 'lodash'
import { dbType, router } from '../types'
import { getSendData, _parseInt, isArr, isObj } from '../utils'
import { SUCCESS, RESULT_DATA_NONE } from '../result'
import {
  parsePaginate,
  parseSort,
  parseSlice,
  parseOperators,
} from '../parseUrl'

export default (db: dbType, key: string, router: router) => {
  router.get(`/${key}`, (ctx, next) => {
    let data: string[] = db.get(key).value()

    // 无参数或者 data 不是数组类型直接发送数据
    if (ctx.querystring === '' || !isArr(data)) {
      ctx.body = getSendData(SUCCESS, data)
      return next()
    }

    let query = ctx.query

    // 参数处理
    const { page } = parsePaginate(query)
    const { sortKey, orderKey } = parseSort(query)
    const { start, end, limit } = parseSlice(query)
    const operatorsObj = parseOperators(query)

    // 数据查询

    // 分析管道
    // getAllByReqUrl => queryCondition => Operators  => Slice => Paginate  => Sort

    // queryCondition

    if (isObj(query)) {
      if (query['id']) {
        query['id'] = _parseInt(query['id'])
      }
      data = _.filter(data, query)
    }

    // Operators 操作符管道
    if (operatorsObj) {
      let fields = Object.keys(operatorsObj)
      if (isArr(fields)) {
        data = _.filter(data, (dataItem) =>
          fields.every((name: any) =>
            operatorsObj[name].every(({ range, operators }) => {
              const compareDataInt = _parseInt(dataItem[name])
              const compareDataString = dataItem[name].toString()
              const rangeInt = _parseInt(range)
              const rangeString = range.toString()
              let res = false
              switch (operators) {
                case 'gte':
                  res = compareDataInt > rangeInt
                  break
                case 'lte':
                  res = compareDataInt < rangeInt
                  break
                case 'ne':
                  res = compareDataInt !== rangeInt
                  break
                case 'like':
                  res = compareDataString.includes(rangeString)
                  break
                case 'num':
                  res = compareDataInt === rangeInt
              }
              return res
            })
          )
        )
      }
    }

    // slice   切割 管道
    if (start !== -1 && end !== -1) {
      data = _.slice(data, start, end)
    }

    // Paginate   分页管道
    data = _.slice(data, (page - 1) * limit, page * limit)

    // Sort   排序管道
    data = _.orderBy(data, sortKey, orderKey)

    // 发送
    if (isArr(data)) {
      ctx.body = getSendData(SUCCESS, data)
    } else {
      ctx.body = getSendData(RESULT_DATA_NONE, null)
    }

    next()
  })
}
