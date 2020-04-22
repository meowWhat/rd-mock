'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var bodyParser = _interopDefault(require('koa-bodyparser'));
var Router = _interopDefault(require('koa-router'));

var router = new Router();
var getRoutes = function (mock) {
    //处理mock
    return router.routes;
};

var app = new Koa();
app.use(bodyParser());
app.use(function (ctx, next) {
    if (ctx.method === 'OPTIONS') {
        ctx.status = 200;
    }
    ctx.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Token,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE',
        'Access-Control-Allow-Credentials': 'true',
    });
    next();
});
var rdMock = function (mockData, port) {
    if (port === void 0) { port = 5111; }
    app.use(getRoutes());
    app.listen(port, function () {
        console.log("Project is running at http://localhost:" + port + "/");
    });
};

exports.rdMock = rdMock;
