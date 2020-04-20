'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Koa = require('koa');
var koaBody = require('koa-body');
var path = require('path');
var Router = require('koa-router');
var Mock = require('mockjs');

const router = new Router();

//编译函数
const getRoutes = (template) => {
  if (Array.isArray(template)) {
    //template 为数组 遍历
    template.forEach((el) => {
      const { url, method, res, param } = el;
      //注册路由 ,返回data
      router[method](url, (ctx, next) => {
        if (param) {
          //接受参数 返回 函数执行结果
          ctx.body = param(ctx.request.body, ctx.query);
        } else {
          ctx.body = res;
        }
        //注入mock
        ctx.body = Mock.mock(ctx.body);
        next();
      });
    });
    return router.routes()
  }
};

const app = new Koa();

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
);
const rdMock = (mock, port = 5111) => {
  app.use(getRoutes(mock));
  app.listen(port, () => {
    console.log(`Project is running at http://localhost:${port}/`);
  });
};

Object.defineProperty(exports, 'Random', {
  enumerable: true,
  get: function () {
    return Mock.Random;
  }
});
exports.rdMock = rdMock;
