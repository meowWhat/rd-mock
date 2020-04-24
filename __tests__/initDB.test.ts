import initDB from '../src/db/initDB'

describe('initDB TEST', () => {
  const schema = {
    'a|5': [
      {
        id: 1,
        'money|1-400': 1,
        name: '@cname',
        address: `@city(true)`,
        email: `@email`,
      },
    ],
    b: [
      {
        id: 1,
        'money|1-400': 1,
        name: '@cname',
        address: `@city(true)`,
        email: `@email`,
      },
    ],
    c: [
      {
        'id|+1': 1,
        'money|1-400': 1,
        name: '@cname',
        address: `@city(true)`,
        email: `@email`,
      },
    ],
  }
  test('initDB ', () => {
    const { db, keys } = initDB(schema)
    expect(db.getState()).toEqual(require('../db.json'))
    expect(keys).toEqual(['a', 'b', 'c'])
  })
})
