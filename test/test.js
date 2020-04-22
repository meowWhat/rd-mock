//引入rdmock | get rdmock
const { rdMock } = require('../dist/index')

//构建mock数据  | create mock data
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
//开启监听 | Listenning on port 3000
rdMock(mock, 3000)

//rdMock 会帮助你分析上面的 数组, 生成接口
//then rdMock will help u create a Interface
