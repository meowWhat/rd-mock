'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var bodyParser = _interopDefault(require('koa-bodyparser'));
var Router = _interopDefault(require('koa-router'));
var mockjs = require('mockjs');
var low = _interopDefault(require('lowdb'));
var FileSync = _interopDefault(require('lowdb/adapters/FileSync'));

var adapter = new FileSync('db.json');
var db = low(adapter);

var DB = (function (schema) {
    //初始化db
    var initDB = {};
    var keys = [];
    Object.keys(schema).forEach(function (key) {
        //解析url
        var url = key.split('|')[0];
        //转换shcema格式
        var temp = {};
        temp[key] = schema[key];
        //生成mock数据
        initDB[url] = mockjs.mock(temp)[url];
        //返回keys 数组
        keys.push(url);
    });
    //写入db.json
    db.defaults(initDB).write();
    return {
        db: db,
        keys: keys,
    };
});

//筛选 gte lte 操作符
var matchOperators = function (query) {
    var regex1 = /\_gte/;
    var regex2 = /\_lte/;
    return Object.keys(query).filter(function (key) { return regex1.test(key) || regex2.test(key); });
};
//解析匹配到的 gte lte 数组 返回一个对象
var getOperators = function (arr, query) {
    var temp = {};
    arr.forEach(function (key) {
        var splits = key.split('_');
        var name = splits[0];
        var operators = splits[1];
        if (!Array.isArray(temp[name])) {
            temp[name] = [];
        }
        var range = _parseInt(query[key]);
        temp[name].push({
            range: range,
            operators: operators,
        });
    });
    return temp;
};
//根据 操作符对象 过滤 返回一个 Boolean
var filterDependOnOperators = function (condition, data) {
    return Object.keys(condition).every(function (key) {
        var objArr = condition[key];
        return objArr.every(function (obj) {
            var temp = _parseInt(data[key]);
            if (obj.operators === 'gte') {
                return temp > obj.range;
            }
            if (obj.operators === 'lte') {
                return temp < obj.range;
            }
            return false;
        });
    });
};
//转int类型
var _parseInt = function (anything) {
    if (typeof anything === 'string') {
        anything = Number.parseInt(anything);
    }
    return anything;
};
//统一接口
var getSendData = function (result, data) {
    return {
        code: result.code,
        data: data,
        message: result.message,
    };
};

//返回值规范
/* 成功状态码 */
var SUCCESS = {
    code: 1,
    message: '成功',
};
var PARAM_IS_BLANK = {
    code: 10002,
    message: '参数为空',
};
/* 数据错误：50001-599999 */
var RESULE_DATA_NONE = {
    code: 50001,
    message: '数据未找到',
};
var DATA_ALREADY_EXISTED = {
    code: 50003,
    message: '数据已存在',
};
/* 接口错误：60001-69999 */
var INTERFACE_ADDRESS_INVALID = {
    code: 60004,
    message: '接口地址无效',
};

var router = new Router();
var getRoutes = function (schema) {
    //初始化 数据库 , 拿到schema 的keys数组
    var _a = DB(schema), db = _a.db, keys = _a.keys;
    //遍历数组 生成路由
    keys.forEach(function (key) {
        //get 查
        router.get("/" + key, function (ctx, next) {
            if (ctx.querystring !== '') {
                /*  初始化阶段 */
                var query = ctx.query;
                var sortKey = ['id'];
                var sortMehod = ['asc'];
                if (query['id'] !== undefined) {
                    //将id 转换为number类型
                    query['id'] = _parseInt(query['id']);
                }
                if (query['_sort'] !== undefined) {
                    //如果设置 sort 字段覆盖初始的 id
                    sortKey[0] = query['_sort'].toString().toLowerCase();
                    delete query['_sort'];
                }
                if (query['_order'] !== undefined) {
                    //如果设置 order 字段覆盖初始的  asc
                    sortKey[0] = query['_order'].toString().toLowerCase();
                    console.log(sortKey);
                    delete query['_order'];
                }
                //筛选操作符 get lte ,决定是否需要筛选
                var res = matchOperators(query);
                /*  分页查询 */
                if (query['_limit'] !== undefined) {
                    //转换成数字
                    var page_1 = 1;
                    if (query['_page'] !== undefined) {
                        page_1 = _parseInt(query['_page']);
                        delete query['_page'];
                    }
                    var limit_1 = _parseInt(query['_limit']);
                    delete query['_limit'];
                    //res为数组长度大于0 => 走 筛选 + 分页
                    if (Array.isArray(res) && res.length > 0) {
                        //解析操作符数组 , 获得好用得格式
                        //将 name_gte=20 解析为 temp 形式
                        var temp_1 = getOperators(res, query);
                        //查询 slowdb
                        var data_1 = db.get(key)
                            .filter(function (el) {
                            //分页 +  操作符 过滤
                            if (el['id'] > (page_1 - 1) * limit_1) {
                                return filterDependOnOperators(temp_1, el);
                            }
                            return false;
                        })
                            .orderBy(sortKey)
                            .take(limit_1)
                            .value();
                        if (data_1) {
                            ctx.body = getSendData(SUCCESS, data_1);
                        }
                        else {
                            ctx.body = getSendData(RESULE_DATA_NONE, null);
                        }
                        // 停止逻辑 继续
                        return;
                    }
                    //只有分页逻辑
                    var data_2 = db.get(key)
                        .filter(function (el) { return el['id'] > (page_1 - 1) * limit_1; })
                        .orderBy(sortKey, sortMehod)
                        .take(limit_1)
                        .value();
                    if (data_2) {
                        ctx.body = getSendData(SUCCESS, data_2);
                    }
                    else {
                        ctx.body = getSendData(RESULE_DATA_NONE, null);
                    }
                    return;
                }
                /*  含操作符条件查询,无分页  ---重复代码 待抽取 --- 考虑中*/
                if (Array.isArray(res) && res.length > 0) {
                    //解析操作符数组 , 获得好用得格式
                    //将 name_gte=20 解析为 temp 形式
                    var temp_2 = getOperators(res, query);
                    //查询 slowdb
                    var data_3 = db.get(key)
                        .filter(function (el) { return filterDependOnOperators(temp_2, el); })
                        .orderBy(sortKey, sortMehod)
                        .value();
                    if (data_3) {
                        ctx.body = getSendData(SUCCESS, data_3);
                    }
                    else {
                        ctx.body = getSendData(RESULE_DATA_NONE, null);
                    }
                    // 停止逻辑 继续
                    return;
                }
                /*  无操作符条件查询
        
                 string !== number
        
                */
                var data = db.get(key).find(query).value();
                if (data) {
                    //查询成功
                    ctx.body = getSendData(SUCCESS, data);
                }
                else {
                    //查询失败
                    ctx.body = getSendData(RESULE_DATA_NONE, null);
                }
            }
            else {
                //无参数 查询所有返回
                ctx.body = getSendData(SUCCESS, db.get(key).value());
            }
            next();
        });
        //delete  删
        router.delete("/" + key, function (ctx, next) {
            //做删除处理 并响应结果
            var condition = ctx.request.body;
            if (condition) {
                //如果有body
                var res = db.get(key).find(condition).value();
                if (res) {
                    db.get(key).remove(condition).write();
                    ctx.body = {
                        code: SUCCESS.code,
                        message: SUCCESS.message + 'delete',
                        data: res,
                    };
                }
                else {
                    //否则 查询数据失败
                    ctx.body = {
                        code: RESULE_DATA_NONE.code,
                        message: RESULE_DATA_NONE.message,
                        data: null,
                    };
                }
            }
            else {
                ctx.body = {
                    code: PARAM_IS_BLANK.code,
                    message: PARAM_IS_BLANK.message,
                    data: null,
                };
            }
            next();
        });
        //post  增
        router.post("/" + key, function (ctx, next) {
            //做添加处理
            var condition = ctx.request.body;
            if (condition && condition.id !== undefined) {
                //如果有body
                var res = db.get(key).find({ id: condition.id }).value();
                if (res) {
                    //查询到结果 => 值已存在 返回存在的值
                    ctx.body = {
                        code: DATA_ALREADY_EXISTED.code,
                        message: DATA_ALREADY_EXISTED.message,
                        data: res,
                    };
                }
                else {
                    db.get(key).push(condition).write();
                    ctx.body = {
                        code: SUCCESS.code,
                        message: SUCCESS.message + 'post',
                        data: condition,
                    };
                }
            }
            else {
                ctx.body = {
                    code: PARAM_IS_BLANK.code,
                    message: PARAM_IS_BLANK.message,
                    data: null,
                };
            }
            next();
        });
        //put  改
        router.put("/" + key, function (ctx, next) {
            //做update处理
            var condition = ctx.request.body;
            if (condition && condition.id !== undefined) {
                //如果有body 并且有id
                var res = db.get(key).find({ id: condition.id }).value();
                if (res) {
                    db.get(key)
                        .find({ id: condition.id })
                        .assign(condition)
                        .write();
                    ctx.body = {
                        code: SUCCESS.code,
                        message: SUCCESS.message + 'put',
                        data: null,
                    };
                }
                else {
                    //数据未找到 无法修改
                    ctx.body = {
                        code: RESULE_DATA_NONE.code,
                        message: RESULE_DATA_NONE.message,
                        data: null,
                    };
                }
            }
            else {
                ctx.body = {
                    code: PARAM_IS_BLANK.code,
                    message: PARAM_IS_BLANK.message,
                    data: null,
                };
            }
            next();
        });
    });
    return router.routes();
};

var app = new Koa();
app.use(bodyParser());
app.use(function (ctx, next) {
    //SET  CORS
    if (ctx.method === 'OPTIONS') {
        ctx.status = 200;
    }
    ctx.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Token,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE',
        'Access-Control-Allow-Credentials': 'true',
    });
    ctx.body = {};
    next();
});
//处理无效请求地址
app.use(function (ctx, next) {
    ctx.body = {
        code: INTERFACE_ADDRESS_INVALID.code,
        message: INTERFACE_ADDRESS_INVALID.message,
        data: null,
    };
    next();
});
//生成  路由  + mock
var rdMock = function (schema, port) {
    if (port === void 0) { port = 3000; }
    app.use(getRoutes(schema));
    app.listen(port, function () {
        console.log("Server is running at http://localhost:" + port + "/");
    });
};

exports.rdMock = rdMock;
