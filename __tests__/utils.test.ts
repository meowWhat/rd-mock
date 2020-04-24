import {
  matchOperators,
  _parseInt,
  getSendData,
  isArr,
  isObj,
} from '../src/utils'
import { SUCCESS } from '../src/result'

describe('utils test', () => {
  const query1 = {
    id: 20,
    _sort: 'id',
    _order: 'desc',
    id_lte: '6',
    id_gte: '1',
    money_lte: '250',
    money_gte: '3',
    id_ne: '4',
    money_num: '45',
    name_like: 'xxx',
    _start: '1',
    _end: '15',
    _limit: '5',
    _page: 2,
  }
  test('matchOperators', () => {
    expect(matchOperators(query1)).toEqual([
      'id_lte',
      'id_gte',
      'money_lte',
      'money_gte',
      'id_ne',
      'money_num',
      'name_like',
    ])
  })

  test('_parseInt', () => {
    expect(_parseInt('1')).toBe(1)
    expect(_parseInt(1)).toBe(1)
    expect(_parseInt('aa')).toBe(NaN)
  })
  test('getSendData', () => {
    expect(getSendData(SUCCESS, 1)).toEqual({
      code: 1,
      message: '成功',
      data: 1,
    })
  })
  test('isArr', () => {
    expect(isArr([])).toBe(false)
    expect(isArr([1])).toBe(true)
    expect(isArr('')).toBe(false)
  })
  test('isObj', () => {
    expect(isObj({})).toBe(false)
    expect(isObj({ id: 0 })).toBe(true)
    expect(isObj([])).toBe(false)
  })
})
