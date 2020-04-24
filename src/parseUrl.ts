import { query, parseOperatorsResult } from './types'
import { matchOperators, _parseInt, filterQuery } from './utils'

//Singular
//Paginate
//Operators  _gte or _lte  or _ne  or  _like or _num
//slice
//sort _sort _order = asc or desc

export const parseSort = (query: query) => {
  //解析url 中的 sort 关键字
  let sortKey = (filterQuery(query, '_sort') || 'id').toString()

  let orderKey: 'asc' | 'desc' = 'asc'

  let temp = filterQuery(query, '_order')

  if (temp === 'asc' || temp === 'desc') {
    orderKey = temp
  }

  return {
    sortKey,
    orderKey,
  }
}

export const parseOperators = (query: query) => {
  let res: parseOperatorsResult = {}

  let arr = matchOperators(query) //[name_lte,name_gte]

  arr.forEach((str) => {
    // name_lte=10 => key=name , operators=lte , range=10
    let splits = str.split('_')
    let key = splits[0]
    let operators = splits[1]
    let range = query[str]
    delete query[str]

    if (!Array.isArray(res[key])) {
      res[key] = []
    }

    res[key].push({
      range,
      operators,
    })
  })

  return res
}

export const parseSlice = (query: query) => {
  //解析slice 操作符 _start _end _limit
  let start = filterQuery(query, '_start')
  let end = filterQuery(query, '_end')
  let limit = filterQuery(query, '_limit')

  start = start === null ? -1 : _parseInt(start)
  end = end === null ? -1 : _parseInt(end)
  limit = limit === null ? 10 : _parseInt(limit)

  return {
    start,
    end,
    limit,
  }
}

export const parsePaginate = (query: query) => {
  let page = filterQuery(query, '_page')

  page = page === null ? 1 : _parseInt(page)

  return {
    page,
  }
}
