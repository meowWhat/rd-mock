//test
const { rdMock } = require('../lib/index')

const schema = {
  'a|5': [
    {
      'id|+1': 1,
      'money|1-400': 1,
      name: '@cname',
      address: `@city(true)`,
      email: `@email`,
    },
  ],
  'b|2': [
    {
      'id|+1': 1,
      'money|1-400': 1,
      name: '@cname',
      address: `@city(true)`,
      email: `@email`,
    },
  ],
  c: {
    id: 1,
    'money|1-400': 1,
    name: '@cname',
    address: `@city(true)`,
    email: `@email`,
  },
  'd|2': [
    {
      'id|+1': 1,
      'money|1-400': 1,
      name: '@cname',
      address: `@city(true)`,
      email: `@email`,
    },
  ],
  e: {
    id: 2,
  },
  g: {
    id: 3,
  },
  'user|12': [
    {
      'id|+1': 1,
      'money|+50': 0,
      name: '@cname',
      address: `@city(true)`,
      email: `@email`,
      title: 'xxx_ok',
    },
  ],
}

// Start  rd-mock  on port 3000
rdMock(schema, { port: 4666 })
