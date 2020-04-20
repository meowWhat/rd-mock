//引入rdmock
const { rdMock } = require('./index')

//构建mock数据
const mock = [
  {
    url: '/', //接口地址
    method: 'get', //请求方式
    res: {
      //自定义res,类型参考mockjs
      'array|5': [
        {
          'id|+1': 1,
          name: '@cname',
          address: `@city(true)`,
          email: `@email`,
          age: '@integer(12, 61)',
          signUpTime: '@datetime',
          prifile: '@cparagraph',
          siteUrl: '@url',
        },
      ],
    },
  },
]
//开启监听
rdMock(mock, 3000)
