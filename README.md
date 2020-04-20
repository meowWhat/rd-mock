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
import { rdMock, Template } from 'rd-mock'

//构建mock数据
const mock: Array<Template> = [
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
```

## 结果展示

```bash

yarn build

```

## 👀 License 授权协议

这个项目 MIT 协议， 请点击 [LICENSE.md](LICENSE.md) 了解更多细节。
