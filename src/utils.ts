export type query = { [key: string]: string | number }

//筛选 gte lte 操作符
export const matchOperators = (query: query) => {
  const regex1 = /\_gte/
  const regex2 = /\_lte/
  return Object.keys(query).filter(
    (key) => regex1.test(key) || regex2.test(key)
  )
}

//getOperators 返回值类型
type getOperatorsRes = {
  [key: string]: {
    operators: string
    range: number
  }[]
}
//解析匹配到的 gte lte 数组 返回一个对象
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

//根据 操作符对象 过滤 返回一个 Boolean
export const filterDependOnOperators = (
  condition: getOperatorsRes,
  data: any
) => {
  return Object.keys(condition).every((key) => {
    let objArr = condition[key]
    return objArr.every((obj) => {
      let temp = _parseInt(data[key])
      if (obj.operators === 'gte') {
        return temp > obj.range
      }

      if (obj.operators === 'lte') {
        return temp < obj.range
      }

      return false
    })
  })
}

//转int类型
export const _parseInt = (anything: string | number) => {
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
