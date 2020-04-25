"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var Koa=_interopDefault(require("koa")),bodyParser=_interopDefault(require("koa-bodyparser")),Router=_interopDefault(require("koa-router")),mockjs=require("mockjs"),low=_interopDefault(require("lowdb")),FileSync=_interopDefault(require("lowdb/adapters/FileSync")),fs=_interopDefault(require("fs")),_=_interopDefault(require("lodash"));fs.existsSync("db.json")&&fs.unlinkSync("db.json");var adapter=new FileSync("db.json"),db=low(adapter),DB=function(n){var a={},o=[];return Object.keys(n).forEach(function(e){var t=e.split("|")[0],r={};r[e]=n[e],a[t]=mockjs.mock(r)[t],o.push(t)}),db.defaults(a).write(),{db:db,keys:o}},matchOperators=function(e){var r=[/\_gte/,/\_lte/,/\_ne/,/\_like/,/\_num/];return Object.keys(e).filter(function(t){return r.some(function(e){return e.test(t)})})},_parseInt=function(e){return"string"==typeof e&&(e=Number.parseInt(e)),e},getSendData=function(e,t){return{code:e.code,data:t,message:e.message}},filterQuery=function(e,t){var r=e[t];return void 0!==r?(delete e[t],r):null},isArr=function(e){return Array.isArray(e)&&0<e.length},isObj=function(e){return"object"==typeof e&&!isArr(e)&&isArr(Object.keys(e))},SUCCESS={code:1,message:"成功"},PARAM_IS_INVALID={code:10001,message:"参数无效"},PARAM_IS_BLANK={code:10002,message:"参数为空"},RESULE_DATA_NONE={code:50001,message:"数据未找到"},DATA_ALREADY_EXISTED={code:50003,message:"数据已存在"},INTERFACE_ADDRESS_INVALID={code:60004,message:"接口地址无效"},parseSort=function(e){var t=(filterQuery(e,"_sort")||"id").toString(),r="asc",n=filterQuery(e,"_order");return"asc"!==n&&"desc"!==n||(r=n),{sortKey:t,orderKey:r}},parseOperators=function(o){var s={};return matchOperators(o).forEach(function(e){var t=e.split("_"),r=t[0],n=t[1],a=o[e];delete o[e],Array.isArray(s[r])||(s[r]=[]),s[r].push({range:a,operators:n})}),s},parseSlice=function(e){var t=filterQuery(e,"_start"),r=filterQuery(e,"_end"),n=filterQuery(e,"_limit");return{start:t=null===t?-1:_parseInt(t),end:r=null===r?-1:_parseInt(r),limit:n=null===n?10:_parseInt(n)}},parsePaginate=function(e){var t=filterQuery(e,"_page");return{page:t=null===t?1:_parseInt(t)}},Get=function(A,y,e){e.get("/"+y,function(e,t){var r=A.get(y).value();if(""===e.querystring||!isArr(r))return e.body=getSendData(SUCCESS,r),t();var n=e.query,a=parsePaginate(n).page,o=parseSort(n),s=o.sortKey,i=o.orderKey,u=parseSlice(n),l=u.start,d=u.end,c=u.limit,S=parseOperators(n);if(isObj(n)&&(n.id&&(n.id=_parseInt(n.id)),r=_.filter(r,n)),S){var f=Object.keys(S);isArr(f)&&(r=_.filter(r,function(s){return f.every(function(o){return S[o].every(function(e){var t=e.range,r=e.operators,n=_parseInt(s[o]);t=_parseInt(t);var a=!1;switch(r){case"gte":a=t<n;break;case"lte":a=n<t;break;case"ne":a=n!==t;break;case"like":a=n.toString().includes(t.toString());break;case"num":a=n===t}return a})})}))}-1!==l&&-1!==d&&(r=_.slice(r,l,d)),r=_.slice(r,(a-1)*c,a*c),r=_.orderBy(r,s,i),isArr(r)?e.body=getSendData(SUCCESS,r):e.body=getSendData(RESULE_DATA_NONE,null),t()})},Post=function(o,s,e){e.post("/"+s,function(e,t){var r=e.request.body;if(isObj(r)&&void 0!==r.id){var n=o.get(s).value();if(isObj(n))if(Object.keys(r).every(function(e){return n[e]===r[e]}))e.body=getSendData(DATA_ALREADY_EXISTED,null);else{var a=[];a.push(n,r),o.set(s,a).write(),e.body=getSendData(SUCCESS,null)}else if(isArr(n)){o.get(s).find(r).value()?e.body=getSendData(DATA_ALREADY_EXISTED,null):(o.get(s).push(r).write(),e.body=getSendData(SUCCESS,null))}else e.body=getSendData(RESULE_DATA_NONE,null)}else e.body=getSendData(PARAM_IS_INVALID,null);t()})},Delete=function(a,o,e){e.delete("/"+o,function(e,t){var r=e.request.body;if(isObj(r)){var n=a.get(o).value();if(isObj(n))Object.keys(r).every(function(e){return n[e]===r[e]})?(a.unset(o).write(),e.body=getSendData(SUCCESS,null)):e.body=getSendData(RESULE_DATA_NONE,null);else if(isArr(n)){a.get(o).find(r).value()?(a.get(o).remove(r).write(),e.body=getSendData(SUCCESS,null)):e.body=getSendData(RESULE_DATA_NONE,null)}else e.body=getSendData(RESULE_DATA_NONE,null)}else e.body=getSendData(PARAM_IS_BLANK,null);t()})},Put=function(o,s,e){e.put("/"+s,function(e,t){var r=e.request.body;if(r&&void 0!==r.id){var n=o.get(s).value();if(isObj(n))o.get(s).assign(r).write(),e.body=getSendData(SUCCESS,null);else if(isArr(n)){var a=o.get(s).find({id:r.id}).value();isObj(a)?(o.get(s).find({id:r.id}).assign(r).write(),e.body=getSendData(SUCCESS,null)):e.body=getSendData(RESULE_DATA_NONE,null)}else e.body=getSendData(RESULE_DATA_NONE,null)}else e.body=getSendData(PARAM_IS_INVALID,null);t()})},router=new Router,getRoutes=function(e){var t=DB(e),r=t.db;return t.keys.forEach(function(e){Post(r,e,router),Delete(r,e,router),Put(r,e,router),Get(r,e,router)}),router.routes()},app=new Koa;app.use(bodyParser()),app.use(function(e,t){"OPTIONS"===e.method&&(e.status=200),e.set({"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"PUT,POST,GET,DELETE","Access-Control-Allow-Credentials":"true"}),e.body={},t()}),app.use(function(e,t){e.body={code:INTERFACE_ADDRESS_INVALID.code,message:INTERFACE_ADDRESS_INVALID.message,data:null},t()});var rdMock=function(e,t){void 0===t&&(t=3e3),app.use(getRoutes(e)),app.listen(t,function(){console.log("Server is running at http://localhost:"+t+"/")})};exports.rdMock=rdMock;
