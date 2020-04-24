'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var bodyParser = _interopDefault(require('koa-bodyparser'));
var Router = _interopDefault(require('koa-router'));
var mockjs = require('mockjs');
var low = _interopDefault(require('lowdb'));
var FileSync = _interopDefault(require('lowdb/adapters/FileSync'));
var fs = _interopDefault(require('fs'));
var _ = _interopDefault(require('lodash'));

if (fs.existsSync('db.json')) {
    fs.unlinkSync('db.json');
}
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

//匹配操作符
var matchOperators = function (query) {
    //筛选 操作符
    var regexArr = [/\_gte/, /\_lte/, /\_ne/, /\_like/, /\_num/];
    return Object.keys(query).filter(function (key) {
        return regexArr.some(function (regex) { return regex.test(key); });
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
//过滤 并干掉内部字段
var filterQuery = function (query, filed) {
    var res = query[filed];
    if (res !== undefined) {
        delete query[filed];
        return res;
    }
    return null;
};
//增强isArr
var isArr = function (anything) {
    return Array.isArray(anything) && anything.length > 0;
};
//增强isObj
var isObj = function (anything) {
    return typeof anything === 'object' &&
        !isArr(anything) &&
        isArr(Object.keys(anything));
};

//返回值规范
/* 成功状态码 */
var SUCCESS = {
    code: 1,
    message: '成功',
};
/* 参数错误：10001-19999 */
var PARAM_IS_INVALID = {
    code: 10001,
    message: '参数无效',
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

//Singular
//Paginate
//Operators  _gte or _lte  or _ne  or  _like or _num
//slice
//sort _sort _order = asc or desc
var parseSort = function (query) {
    //解析url 中的 sort 关键字
    var sortKey = (filterQuery(query, '_sort') || 'id').toString();
    var orderKey = 'asc';
    var temp = filterQuery(query, '_order');
    if (temp === 'asc' || temp === 'desc') {
        orderKey = temp;
    }
    return {
        sortKey: sortKey,
        orderKey: orderKey,
    };
};
var parseOperators = function (query) {
    var res = {};
    var arr = matchOperators(query); //[name_lte,name_gte]
    arr.forEach(function (str) {
        // name_lte=10 => key=name , operators=lte , range=10
        var splits = str.split('_');
        var key = splits[0];
        var operators = splits[1];
        var range = query[str];
        delete query[str];
        if (!Array.isArray(res[key])) {
            res[key] = [];
        }
        res[key].push({
            range: range,
            operators: operators,
        });
    });
    return res;
};
var parseSlice = function (query) {
    //解析slice 操作符 _start _end _limit
    var start = filterQuery(query, '_start');
    var end = filterQuery(query, '_end');
    var limit = filterQuery(query, '_limit');
    start = start === null ? -1 : _parseInt(start);
    end = end === null ? -1 : _parseInt(end);
    limit = limit === null ? 10 : _parseInt(limit);
    return {
        start: start,
        end: end,
        limit: limit,
    };
};
var parsePaginate = function (query) {
    var page = filterQuery(query, '_page');
    page = page === null ? 1 : _parseInt(page);
    return {
        page: page,
    };
};

var Get = (function (db, key, router) {
    router.get("/" + key, function (ctx, next) {
        var data = db.get(key).value();
        //无参数 或者data 不是数组类型 直接发送数据 , -- 因为路由生成依靠与 data 所以 不需要判断data
        if (ctx.querystring === '' || !isArr(data)) {
            ctx.body = getSendData(SUCCESS, data);
            return next();
        }
        var query = ctx.query;
        //参数处理
        var page = parsePaginate(query).page;
        var _a = parseSort(query), sortKey = _a.sortKey, orderKey = _a.orderKey;
        var _b = parseSlice(query), start = _b.start, end = _b.end, limit = _b.limit;
        var operatorsObj = parseOperators(query);
        //数据查询
        //分析管道
        // getAllbyReqUrl => queryConditon => Operators  => Slice => Paginate  => Sort
        //queryConditon
        if (isObj(query)) {
            if (query['id']) {
                query['id'] = _parseInt(query['id']);
            }
            data = _.filter(data, query);
        }
        //Operators 操作符管道
        if (operatorsObj) {
            var fileds_1 = Object.keys(operatorsObj);
            if (isArr(fileds_1)) {
                data = _.filter(data, function (dataItem) {
                    return fileds_1.every(function (name) {
                        return operatorsObj[name].every(function (_a) {
                            var range = _a.range, operators = _a.operators;
                            var compareData = _parseInt(dataItem[name]);
                            range = _parseInt(range);
                            var res = false;
                            switch (operators) {
                                case 'gte':
                                    res = compareData > range;
                                    break;
                                case 'lte':
                                    res = compareData < range;
                                    break;
                                case 'ne':
                                    res = compareData !== range;
                                    break;
                                case 'like':
                                    res = compareData.toString().includes(range.toString());
                                    break;
                                case 'num':
                                    res = compareData === range;
                            }
                            return res;
                        });
                    });
                });
            }
        }
        //slice   切割 管道
        if (start !== -1 && end !== -1) {
            data = _.slice(data, start, end);
        }
        //Paginate   分页管道
        data = _.slice(data, (page - 1) * limit, page * limit);
        //Sort   排序管道
        data = _.orderBy(data, sortKey, orderKey);
        // 发送
        if (isArr(data)) {
            ctx.body = getSendData(SUCCESS, data);
        }
        else {
            ctx.body = getSendData(RESULE_DATA_NONE, null);
        }
        next();
    });
});

var Post = (function (db, key, router) {
    router.post("/" + key, function (ctx, next) {
        //做添加处理
        var condition = ctx.request.body;
        if (condition && condition.id !== undefined) {
            //如果有body
            var res = db.get(key).find({ id: condition.id }).value();
            if (res) {
                //查询到结果 => 值已存在 返回存在的值
                ctx.body = getSendData(DATA_ALREADY_EXISTED, res);
            }
            else {
                db.get(key).push(condition).write();
                ctx.body = getSendData(SUCCESS, condition);
            }
        }
        else {
            //必须要求携带body  => 不然无法知道添加什么
            ctx.body = getSendData(PARAM_IS_BLANK, null);
        }
        next();
    });
});

var Delete = (function (db, key, router) {
    //delete  删
    router.delete("/" + key, function (ctx, next) {
        //做删除处理 并响应结果
        var condition = ctx.request.body;
        if (condition) {
            //如果有body
            var res = db.get(key).find(condition).value();
            if (res) {
                db.get(key).remove(condition).write();
                ctx.body = getSendData(SUCCESS, res);
            }
            else {
                //否则 查询数据失败
                ctx.body = getSendData(RESULE_DATA_NONE, null);
            }
        }
        else {
            ctx.body = getSendData(PARAM_IS_BLANK, null);
        }
        next();
    });
});

var Put = (function (db, key, router) {
    //put  改
    router.put("/" + key, function (ctx, next) {
        //做update处理
        var condition = ctx.request.body;
        if (condition) {
            if (condition.id !== undefined) {
                //如果有body 并且有id
                var res = db.get(key).find({ id: condition.id }).value();
                if (res) {
                    db.get(key)
                        .find({ id: condition.id })
                        .assign(condition)
                        .write();
                    ctx.body = getSendData(SUCCESS, null);
                }
                else {
                    //数据未找到 无法修改
                    ctx.body = getSendData(RESULE_DATA_NONE, null);
                }
            }
            else {
                ctx.body = getSendData(PARAM_IS_INVALID, null);
            }
        }
        else {
            ctx.body = getSendData(PARAM_IS_BLANK, null);
        }
        next();
    });
});

var router = new Router();
var getRoutes = function (schema) {
    //初始化 数据库 , 拿到schema 的keys数组
    var _a = DB(schema), db = _a.db, keys = _a.keys;
    //遍历数组 生成路由
    keys.forEach(function (key) {
        //增
        Post(db, key, router);
        //删
        Delete(db, key, router);
        //改
        Put(db, key, router);
        //查
        Get(db, key, router);
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
        'Access-Control-Allow-Headers': 'Content-Type',
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
