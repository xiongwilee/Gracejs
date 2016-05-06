'use strict';

const path = require('path');
const koa = require('koa');
const responseTime = require('koa-response-time');
const mock = require('koa-grace-mock');
const router = require('koa-grace-router');
const vhost = require('koa-grace-vhost');
const proxy = require('koa-grace-proxy');
const mongo = require('koa-grace-mongo');
const xload = require('koa-grace-xload');
const logger = require('koa-logger');
const gzip = require('koa-gzip');
const views = require('koa-grace-views');
const bodyparser = require('koa-bodyparser');
const _static = require('koa-grace-static');

// const conditional = require('koa-conditional-get');
// const etag = require('koa-etag');

let config = global.config;
let config_vhost = global.config.vhost;
let config_proxy = global.config.proxy;
let config_api = global.config.api;
let config_path = global.config.path;
let config_path_project = global.config.path.project;
let config_site = global.config.site;
let config_template = global.config.template;
let config_mongo = global.config.mongo;
let config_mock = global.config.mock;
let config_xload = global.config.xload;

let app = koa();

// 加由于静态文件添加etag的意义不大，先干掉etag处理
// app.use(conditional());
// app.use(etag());

// 在response中返回头信息：X-Response-Time
// 服务器处理时间
// this.fetch处理下载会有“Error: Can't set headers after they are sent”的报错，暂时隐藏
// app.use(responseTime());

// logger
app.use(logger());

// bodyparser
app.use(bodyparser({
  formLimit: '5mb'
}));

// gzip 
app.use(gzip());

// 配置静态文件路由
app.use(_static(['/static/**/*', '/*/static/**/*'], {
  dir: config_path_project,
  maxage: config_site.env == 'production' && 60 * 60 * 1000
}));


// 上传下载功能
app.use(xload(app, config_xload));

let vhosts = [];
for (let item in config_vhost) {
  vhosts.push(item);
}

vhosts = vhosts.map(function(item) {
  let vapp = koa();

  let appName = config_vhost[item];
  let appPath = path.resolve(config_path_project + '/' + appName);

  // 在开发环境才使用mock数据功能
  config_site.env == 'development' && vapp.use(mock(vapp, {
    root: appPath + '/mock/',
    prefix: config_mock.prefix + appName
  }))

  // 如果配置了连接数据库
  config_mongo.api[appName] && vapp.use(mongo(vapp, {
    root: appPath + '/model/mongo',
    connect: config_mongo.api[appName]
  }))

  // 配置api
  vapp.use(proxy(vapp, config_api, {
    timeout: config_proxy.timeout // 接口超时时间
  }));

  // 配置模板引擎
  let template = (typeof config_template == 'object' ? config_template[appName] : config_template);
  vapp.use(views(appPath + '/views', {
    root: appPath + '/views',
    map: {
      html: template || 'swig'
    },
    cache: config_site.env == 'production' && 'memory'
  }));

  // 配置控制器文件路由
  vapp.use(router(vapp, {
    root: appPath + '/controller',
    default_path: config_path.default_path[appName],
    domain: item
  }));

  vapp.on('error', function(err, ctx) {
    log.error('server error', err, ctx);
  });

  return {
    host: item,
    app: vapp
  };
}).filter(function(item) {
  return !!item;
});

// 注入vhost路由
app.use(vhost(vhosts));


module.exports = app;
