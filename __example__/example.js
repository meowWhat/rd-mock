const { rdMock } = require('../index')

//use `mockjs` schema  to create rd-mock data
//rd-mock require filed 'id' in schema
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
}

// Start  rd-mock  on port 3000
rdMock(schema, 3000)
