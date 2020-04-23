//引入rdmock | get rdmock
const { rdMock } = require('../dist/index')

//构建mock数据  | create mock data
const schema = {
  //自定义res,类型参考mockjs
  'a|15': [
    {
      'id|+1': 1,
      'money|1-400': 1,
      name: '@cname',
      address: `@city(true)`,
      email: `@email`,
    },
  ],
}

//开启监听 | Listenning on port 3000
rdMock(schema, 3000)

//rdMock 会帮助你分析上面的 数组, 生成接口
//then rdMock will help u create a Interface
