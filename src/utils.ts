import { query } from './types'

//匹配操作符
export const matchOperators = (query: query) => {
  //筛选 操作符
  const regexArr = [/\_gte/, /\_lte/, /\_ne/, /\_like/, /\_num/]

  return Object.keys(query).filter((key) =>
    regexArr.some((regex) => regex.test(key))
  )
}

//解析匹配到的  数组 返回一个对象
export const getOperators = (arr: Array<string>, query: query) => {
  let temp: {
    [key: string]: Array<{ operators: string; range: number }>
  } = {}
  arr.forEach((key) => {
    let splits = key.split('_')
    let name = splits[0]
    let operators = splits[1]
    if (!Array.isArray(temp[name])) {
      temp[name] = []
    }
    let range = _parseInt(query[key])
    temp[name].push({
      range,
      operators,
    })
  })
  return temp
}

//转int类型
export const _parseInt = (anything: string | number): number => {
  if (typeof anything === 'string') {
    anything = Number.parseInt(anything)
  }
  return anything
}

//统一接口
export const getSendData = (
  result: {
    code: number
    message: string
  },
  data: any
) => {
  return {
    code: result.code,
    data: data,
    message: result.message,
  }
}

//过滤 并干掉内部字段
export const filterQuery = (
  query: query,
  filed: '_start' | '_end' | '_limit' | '_sort' | '_order' | '_page' | '_num'
) => {
  let res = query[filed]

  if (res !== undefined) {
    delete query[filed]
    return res
  }

  return null
}

//增强isArr
export const isArr = (anything: any) =>
  Array.isArray(anything) && anything.length > 0

//增强isObj
export const isObj = (anything: any) =>
  typeof anything === 'object' &&
  !isArr(anything) &&
  isArr(Object.keys(anything))
