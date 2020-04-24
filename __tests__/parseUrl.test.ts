import {
  parseSort,
  parseOperators,
  parseSlice,
  parsePaginate,
} from '../src/parseUrl'

describe('parseUrl test', () => {
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
  const query2 = { id: 30, _sort: 'money', _order: 'asc' }
  test('parseSort', () => {
    expect(parseSort(query1)).toEqual({
      sortKey: 'id',
      orderKey: 'desc',
    })
    expect(parseSort(query2)).toEqual({
      sortKey: 'money',
      orderKey: 'asc',
    })
  })
  test('parseOperators', () => {
    expect(parseOperators(query1)).toEqual({
      id: [
        { range: '6', operators: 'lte' },
        { range: '1', operators: 'gte' },
        { range: '4', operators: 'ne' },
      ],
      money: [
        { range: '250', operators: 'lte' },
        {
          range: '3',
          operators: 'gte',
        },
        {
          range: '45',
          operators: 'num',
        },
      ],
      name: [{ range: 'xxx', operators: 'like' }],
    })
  })
  test('parseSlice', () => {
    expect(parseSlice(query1)).toEqual({ start: 1, end: 15, limit: 5 })
    expect(parseSlice(query2)).toEqual({ start: -1, end: -1, limit: 10 })
  })
  test('parsePaginate', () => {
    expect(parsePaginate(query1)).toEqual({ page: 2 })
    expect(parsePaginate(query2)).toEqual({ page: 1 })
  })
  test('内置字段删除测试', () => {
    expect(query1).toEqual({ id: 20 })
    expect(query2).toEqual({ id: 30 })
  })
})
