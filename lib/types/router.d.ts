/// <reference types="koa" />
/// <reference types="koa-bodyparser" />
/// <reference types="koa-compose" />
import Router from 'koa-router';
import { schema } from './types';
export declare const getRoutes: (schema: schema) => import("koa-compose").Middleware<import("koa").ParameterizedContext<any, Router.IRouterParamContext<any, {}>>>;
