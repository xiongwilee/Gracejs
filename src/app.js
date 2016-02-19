'use strict';

const path = require('path'),
  koa = require('koa'),
  router = require('koa-grace-router'),
  vhost = require('koa-grace-vhost'),
  proxy = require('koa-grace-proxy'),
  model = require('koa-grace-model'),
  mongo = require('koa-grace-mongo'),
  logger = require('koa-logger'),
  gzip = require('koa-gzip'),
  views = require('koa-views'),
  bodyparser = require('koa-bodyparser'),
  onerror = require('koa-onerror'),
  mount = require('koa-mount'),
  koastatic = require('koa-static');

let config = global.config;
let config_vhost = global.config.vhost;
let config_api = global.config.api;
let config_path = global.config.path;
let config_path_project = global.config.path.project;
let config_site = global.config.site;
let config_mongo = global.config.mongo;

let app = koa();

// bodyparser
app.use(bodyparser({
  formLimit:'5mb'
}));

// gzip
app.use(gzip());

let vhosts = [];
for (let item in config_vhost) {
  vhosts.push(item);
}

vhosts = vhosts.map(function(item) {
  let vapp = koa();

  let appName = config_vhost[item];
  let appPath = path.resolve(config_path_project + '/' + appName);

  // 如果配置了连接数据库
  config_mongo[appName] && vapp.use(mongo(vapp,{
    root: appPath + '/model/mongo',
    connect: config_mongo[appName]
  }))

  // 配置api
  vapp.use(proxy(vapp, {
    api: config_api
  }));

  // 配置默认路由
  vapp.use(model(vapp, {
    root: appPath + '/model'
  }));

  // 配置模板引擎
  vapp.use(views(appPath + '/views', {
    root: appPath + '/views',
    map: {
      html: 'swig'
    }
  }));

  // 配置静态文件路由
  vapp.use(mount('/static',
    koastatic(appPath + '/static')
  ));

  // 配置控制器文件路由
  vapp.use(router(vapp, {
    root: appPath + '/controller',
    default_path: config_path.default_path[appName]
  }));

  vapp.use(logger());

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