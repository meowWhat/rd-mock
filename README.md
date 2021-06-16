# rd-mock

> Get a full fake REST API And MockData with zero coding in less than 30 seconds,inspired by json-serve && mockjs

> 🔗 [GitHub](https://github.com/meowWhat/rd-mock) -- [Npm](https://www.npmjs.com/package/rd-mock)

## Getting Started

### 📦 Install rd-mock

```bash
yarn add rd-mock --dev # or：npm install rd-mock --dev
```

### 🔨 Usage example

- use rd-mock to start server

```javascript
const { rdMock } = require('../lib/index')

// use `mockjs` schema  to create rd-mock data
// rd-mock require filed 'id' in schema
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
rdMock(schema, {
  port: 3000,
  delay: 0,
  responseInterceptors: [
    async (ctx, next) => {
      if (ctx.request.method === 'GET' && ctx.request.url === 'a') {
        const { data } = ctx.body
        ctx.body.data = {
          count: 400,
          list: data,
        }
      }
      await next()
    },
  ],
  requestInterceptors: [
    async (ctx, next) => {
      const query = ctx.query
      if (query['page']) {
        query['_page'] = query['page']
        delete query['page']
      }
      if (query['pageSize']) {
        query['_limit'] = query['pageSize']
        delete query['pageSize']
      }
      await next()
    },
  ],
})
```

- use simple router

```javascript
const url = 'http://localhost:3000/a'
fetch(`${url}`, {
  //get data
  method: 'GET',
})
  .then((res) => res.json())
  .then((response) => {
    console.log('all data', response)
    return fetch(`${url}`, {
      //create data
      method: 'POST',
      body: JSON.stringify({ id: 6, name: 'create data' }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
  })
  .then(() => {
    return fetch(`${url}`, {
      // update data
      method: 'PUT',
      body: JSON.stringify({ id: 5, name: 'update date' }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
  })
  .then(() => {
    return fetch(`${url}`, {
      // delete data
      method: 'DELETE',
      body: JSON.stringify({ id: 1 }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
  })
```

- check the db.json

```json
{
  "a": [
    {
      "id": 2,
      "money": 316,
      "name": "阎敏",
      "address": "辽宁省 丹东市",
      "email": "p.nieip@qxtw.wf"
    },
    {
      "id": 3,
      "money": 391,
      "name": "史军",
      "address": "青海省 海东市",
      "email": "e.ubyqkg@sopfvyns.gf"
    },
    {
      "id": 4,
      "money": 326,
      "name": "邱敏",
      "address": "上海 上海市",
      "email": "f.yfbbzpj@dijrig.st"
    },
    {
      "id": 5,
      "money": 81,
      "name": "update date",
      "address": "西藏自治区 山南地区",
      "email": "v.zabx@mbpcrp.pa"
    },
    {
      "id": 6,
      "name": "create data"
    }
  ]
}
```

## Schema

- Refer to [mockjs](http://mockjs.com/examples.html) for more demonstrations about Schema

## Router Rule

### Singular routes

```
GET    /profile
POST   /profile
PUT    /profile
PATCH  /profile
```

### Filter

- use '\_num' to parse string '20'

```
GET /posts?name=xxx&id=1
GET /posts?number_num=20
```

### Paginate

- Use \_page and \_limit to paginate data.

```
GET /posts?_page=2

GET /posts?_page=3&_limit=5
```

- default \_page = 1 , default \_limit =10

### Sort

- Add \_sort and \_order

```
GET /posts?_sort=id&_order=asc
GET /posts?_order=desc
```

- default \_sort = id ; default \_order=asc

### Slice

- Add \_start and \_end

```
GET /posts?_start=20&_end=30

```

- default \_start = -1 ; default \_end =-1
- Works exactly as Array.slice

### Operators

- Add \_gte or \_lte for getting a range

```
GET /posts?views_gte=10
GET /posts?views_gte=5&view_lte=20&id_lte=10
```

- Add \_ne to exclude a value

```
GET /posts?id_ne=1
```

- Add \_like to filter

```
GET /posts?title_like=xxx
```

- Works exactly as String.includes

### Warning

- Same field Only one operator will be matched

```
// wrong
 get('/user?id_ne=1&id_ne=2&id_ne=3'))
// only  id_ne =3   will work

// right
get('/user?id_ne=8&id_gte=5')

```

- the \_limit=10 is default when you used operator pipe

```
// schema
'user|20': [
    {
      'id|+1': 1,
    },
  ],

// test
 expect((await axios.get('/user?id_gte=0')).data.data.length).toBe(10)


// but you can set the _limit to change the defalut _limit

// test
 expect((await axios.get('/user?id_gte=0&_limit=20')).data.data.length).toBe(20)
```

## Result

- only GET request will fetch the Data, and the rest of the requests have only a status code and status msg

```javascript
export const SUCCESS = {
  rtn: 0,
  msg: '成功',
  data: null,
}

/* 参数错误：10001-19999 */
export const PARAM_IS_INVALID = {
  rtn: 10001,
  msg: '参数无效',
  data: 'any',
}
export const PARAM_IS_BLANK = {
  code: 10002,
  msg: '参数为空',
  data: 'any',
}

/* 系统错误：40001-49999 */
export const SYSTEM_INNER_ERROR = {
  rtn: 40001,
  msg: '系统繁忙，请稍后重试',
  data: 'any',
}
/* 数据错误：50001-599999 */
export const RESULE_DATA_NONE = {
  rtn: 50001,
  msg: '数据未找到',
  data: 'any',
}
export const DATA_IS_WRONG = {
  rtn: 50002,
  msg: '数据有误',
  data: 'any',
}
export const DATA_ALREADY_EXISTED = {
  rtn: 50003,
  msg: '数据已存在',
  data: 'any',
}
/* 接口错误：60001-69999 */
export const INTERFACE_ADDRESS_INVALID = {
  rtn: 60004,
  msg: '接口地址无效',
  data: 'any',
}
```

## Router Pipe

```
getAllDataByReqUrl  => data

 if  (Array.isArray(data) && data.length > 0) {

=> queryConditon => Operators  => Slice => Paginate  => Sort


} else {

 return data

}

```

## 👀 License

MIT [LICENSE.md](LICENSE.md)
