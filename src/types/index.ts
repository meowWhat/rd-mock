import { LowdbSync } from 'lowdb'
import Router from 'koa-router'

export type query = { [key: string]: string | number } // ctx.query

export type schema = { [key: string]: Array<any> } //schema

export type dbType = LowdbSync<any>

export type router = Router<any, {}>

export type parseOperatorsResult = {
  [key: string]: Array<{ operators: string; range: number | string }>
}
