"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Koa=require("koa"),koaBody=require("koa-body-parser"),Router=require("koa-router"),Mock=require("mockjs"),router=new Router,getRoutes=function(o){if(Array.isArray(o))return o.forEach(function(o){var e=o.url,r=o.method,t=o.res,n=o.param;router[r](e,function(o,e){o.body=n?n(o.request.body,o.query):t,o.body=Mock.mock(o.body),e()})}),router.routes()},app=new Koa;app.use(koaBody()),app.use(function(o,e){"OPTIONS"===o.method&&(o.status=200),o.set({"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"X-Token,Content-Type","Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,PATCH","Access-Control-Allow-Credentials":"true"}),e()});var rdMock=function(o,e){var r=1<arguments.length&&void 0!==e?e:5111;app.use(getRoutes(o)),app.listen(r,function(){console.log("Project is running at http://localhost:".concat(r,"/"))})};Object.defineProperty(exports,"Random",{enumerable:!0,get:function(){return Mock.Random}}),exports.rdMock=rdMock;
