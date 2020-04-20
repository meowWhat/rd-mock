import * as Koa from 'koa'
import * as koaBody from 'koa-body'
import * as path from 'path'

import { getRoutes } from './complier'
import { Random } from 'mockjs'

const app = new Koa()

app.use(
  koaBody({
    multipart: true, // 支持文件上传
    encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    },
  })
)
const rdMock = (mock, port = 5111) => {
  app.use(getRoutes(mock))
  app.listen(port, () => {
    console.log(`Project is running at http://localhost:${port}/`)
  })
}

export { rdMock, Random }
