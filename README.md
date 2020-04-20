# rd-mock

> 帮助你开启服务器,通过配置实现自动化接口, 解决前后端开发 模拟数据的问题！！

## Getting Started 使用指南

### ⚠️ Prerequisites 项目使用条件

请确保你的电脑安装过 Node.js 并且 Node.js 的版本大于 8.

### 📦 Installation 安装

```bash

# 安装
yarn  add rd-mock --dev # 或者：npm install rd-mock --dev

```

### 🔨 Usage example 使用示例

```typescript
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

//rdMock 会帮助你分析上面的 数组, 生成接口
```

## 结果展示(访问http://localhost:3000/)

```json
{
  "array": [
    {
      "id": 6,
      "name": "熊明",
      "address": "广东省 佛山市",
      "email": "x.ekjh@epx.net.cn",
      "age": 42,
      "signUpTime": "1976-04-27 01:10:24",
      "prifile": "干此领义以至论北养严南选器状离得。子参斗音果连西律音式得积东。据给斯转正资交压青改见少。",
      "siteUrl": "tn3270://qkbxqv.dm/kjfp"
    },
    {
      "id": 7,
      "name": "姜磊",
      "address": "安徽省 巢湖市",
      "email": "c.aroxsjuo@cbobw.pg",
      "age": 40,
      "signUpTime": "1987-03-30 18:49:27",
      "prifile": "上眼主称么共算圆资记候育化业它军术。始法元数农难酸观好现品入每易意使格江。认但证家层往地非活历传合。她装严为类改府果常观加场外件品美证。色厂指高你易集号件听就变下北今层上。完事种格作须不林别放王积。",
      "siteUrl": "mid://gshymcg.ls/fbl"
    },
    {
      "id": 8,
      "name": "顾杰",
      "address": "河南省 周口市",
      "email": "d.pmrfs@kywvpy.mm",
      "age": 52,
      "signUpTime": "2012-05-14 05:31:30",
      "prifile": "约系具品办商适头路六素育没确须结。生称易任家所美相准单深马管具者属传。料学空规五千劳住红自千水具地光声权。世难支示人自志二看联调置米因农动科。",
      "siteUrl": "nntp://serdagkhb.br/nnipznsieu"
    },
    {
      "id": 9,
      "name": "卢杰",
      "address": "海外 海外",
      "email": "l.ndmyrmwd@eblhpda.sj",
      "age": 33,
      "signUpTime": "1973-01-01 12:09:05",
      "prifile": "也基际严张光织学展从周色改。关严离果明志代更活设收论成处发段。子保应力层规着相那理律数。其二们至低之上除取声也度七。毛民五已是族东用半月己米每上增。应学约运原本九九据比越新。",
      "siteUrl": "nntp://ypwdw.pr/igc"
    },
    {
      "id": 10,
      "name": "万强",
      "address": "江西省 抚州市",
      "email": "o.ifbyxme@eyptekg.hk",
      "age": 17,
      "signUpTime": "2006-11-18 06:31:57",
      "prifile": "前验油江时果属东长是热指。线因走用响名江个间每研想内其由结总。代你全走识则走强务却生料引合出场其。法阶史资化接类类部电参持按。火管本放集需强义角前展会心做。林照得铁开济小把技元阶率争。个般书代主建分想风力头制正。",
      "siteUrl": "http://jhg.fi/jwaul"
    }
  ]
}
```

## 👀 License 授权协议

这个项目 MIT 协议， 请点击 [LICENSE.md](LICENSE.md) 了解更多细节。
