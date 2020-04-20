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
  {
    url: '/', //接口地址
    method: 'post', //请求方式
    param: (param, query) => {
      //param 获取 请求体传参
      //query 获取 url传参
      //需要你返回一个值 来决定 请求的结果
      if (query.name === 'bug') {
        return {
          code: 200,
          message: '恭喜你找到了 bug ~~~~',
        }
      }
      if (param.username === 'admin' && param.password === 'admin') {
        return {
          code: 200,
          message: 'ok',
        }
      }
      return {
        code: 400,
        message: '账号或密码错误',
      }
    },
  },
]
//开启监听
rdMock(mock, 3000)
