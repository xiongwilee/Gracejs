'use strict';

const path = require('path');
const koa = require('koa');
const mock = require('koa-grace-mock');
const router = require('koa-grace-router');
const vhost = require('koa-grace-vhost');
const proxy = require('koa-grace-proxy');
const mongo = require('koa-grace-mongo');
const xload = require('koa-grace-xload');
const views = require('koa-grace-views');
const body = require('koa-grace-body');
const csrf = require('koa-grace-csrf');
const _static = require('koa-grace-static');
const compress = require('koa-compress');

let config = global.config;

let app = koa();

// compress
app.use(compress());

// body
app.use(body({
  formLimit: '5mb'
}));

// 配置静态文件路由
app.use(_static(['/static/**/*', '/*/static/**/*'], {
  dir: config.path.project,
  maxage: config.site.env == 'production' && 60 * 60 * 1000
}));

// 上传下载功能
app.use(xload(app, config.xload));

// 获取vhost
let vhosts = Object.keys(config.vhost);
// 注入vhost路由
app.use(vhost(vhosts.map((item) => {
  let vapp = koa();

  let appName = config.vhost[item];
  let appPath = path.resolve(config.path.project + '/' + appName);

  // 如果在csrf的module名单里才使用csrf防护功能
  config.csrf.module.indexOf(appName) > -1 && vapp.use(csrf(vapp))

  // 在开发环境才使用mock数据功能
  config.site.env == 'development' && vapp.use(mock(vapp, {
    root: appPath + '/mock/',
    prefix: config.mock.prefix + appName
  }))

  // 如果配置了连接数据库
  config.mongo.api[appName] && vapp.use(mongo(vapp, {
    root: appPath + '/model/mongo',
    connect: config.mongo.api[appName]
  }))

  // 配置api
  vapp.use(proxy(vapp, config.api, {
    timeout: config.proxy.timeout, // 接口超时时间
    dsn: config.proxy.dsn // 线上才传dsn
  }));

  // 配置模板引擎
  let template = (typeof config.template == 'object' ? config.template[appName] : config.template);
  vapp.use(views(appPath + '/views', {
    root: appPath + '/views',
    map: {
      html: template || 'swig'
    },
    cache: config.site.env == 'production' && 'memory'
  }));

  // 配置控制器文件路由
  vapp.use(router(vapp, {
    root: appPath + '/controller',
    default_path: config.path.default_path[appName],
    default_jump: config.path.default_jump[appName],
    domain: item,
    errorPath: '/error/404'
  }));

  return {
    host: item,
    app: vapp
  };
}).filter((item) => {
  return !!item;
})));

module.exports = app;
