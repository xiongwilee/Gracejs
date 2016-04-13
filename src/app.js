'use strict';

const path = require('path'),
  koa = require('koa'),
  mock = require('koa-grace-mock'),
  router = require('koa-grace-router'),
  vhost = require('koa-grace-vhost'),
  proxy = require('koa-grace-proxy'),
  mongo = require('koa-grace-mongo'),
  logger = require('koa-logger'),
  gzip = require('koa-gzip'),
  views = require('koa-grace-views'),
  bodyparser = require('koa-bodyparser'),
  _static = require('koa-grace-static');

let config = global.config;
let config_vhost = global.config.vhost;
let config_api = global.config.api;
let config_path = global.config.path;
let config_path_project = global.config.path.project;
let config_site = global.config.site;
let config_template = global.config.template;
let config_mongo = global.config.mongo;
let config_mock = global.config.mock;

let app = koa();

// bodyparser
app.use(bodyparser({
  formLimit:'5mb'
}));

// gzip
app.use(gzip());

// 配置静态文件路由
app.use(_static('/static', config_path_project, config_vhost));

let vhosts = [];
for (let item in config_vhost) {
  vhosts.push(item);
}

vhosts = vhosts.map(function(item) {
  let vapp = koa();

  let appName = config_vhost[item];
  let appPath = path.resolve(config_path_project + '/' + appName);

  // 如果是在开发环境才使用mock数据功能
  config_site.env == 'development' && vapp.use(mock(vapp,{
    root: appPath + '/mock/',
    prefix: config_mock.prefix + appName
  }))

  // 如果配置了连接数据库
  config_mongo.api[appName] && vapp.use(mongo(vapp,{
    root: appPath + '/model/mongo',
    connect: config_mongo.api[appName]
  }))

  // 配置api
  vapp.use(proxy(vapp, {
    api: config_api
  }));

  // 配置模板引擎
  let template = (typeof config_template == 'object' ? config_template[appName] : config_template);
  vapp.use(views(appPath + '/views', {
    root: appPath + '/views',
    map: {
      html: template || 'swig'
    },
    cache: (config_site.env == 'production' ? 'memory' : false)
  }));

  // 配置控制器文件路由
  vapp.use(router(vapp, {
    root: appPath + '/controller',
    default_path: config_path.default_path[appName],
    domain: item
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