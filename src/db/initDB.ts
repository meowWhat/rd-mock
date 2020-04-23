import { mock } from 'mockjs'
import db from './db'
import { schema } from '../types'

export default (schema: schema) => {
  //初始化db
  let initDB: { [key: string]: any } = {}
  let keys: string[] = []

  Object.keys(schema).forEach((key) => {
    //解析url
    let url = key.split('|')[0]
    //转换shcema格式
    let temp: { [key: string]: any } = {}
    temp[key] = schema[key]
    //生成mock数据
    initDB[url] = mock(temp)[url]
    //返回keys 数组
    keys.push(url)
  })

  //写入db.json
  db.defaults(initDB).write()

  return {
    db,
    keys,
  }
}
