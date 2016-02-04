'use strict';

const path = require('path'),
  koa = require('koa'),
  router = require('koa-hornbill-router'),
  vhost = require('koa-hornbill-vhost'),
  logger = require('koa-logger'),
  views = require('koa-views'),
  onerror = require('koa-onerror'),
  koastatic = require('koa-static');

let config = global.config;
let config_vhost = global.config.vhost;
let config_path = global.config.path;
let config_path_project = global.config.path.project;
let config_site = global.config.site;

let app = koa();

let vhosts = [];
for(let item in config_vhost){
  vhosts.push(item);
}

vhosts = vhosts.map(function(item) {
    let vapp = koa();

    let appName = config_vhost[item];
    let appPath = path.resolve(config_path_project + '/' + appName);

    // 配置模板引擎
    vapp.use(views(appPath + '/views', {
      root: appPath + '/views',
      map: { html: 'ejs' }
    }));

    // 配置静态文件路由
    vapp.use(koastatic(appPath + '/static', {
      prefix: 'static'
    }));

    vapp.use(logger());

    vapp.on('error', function(err, ctx) {
      log.error('server error', err, ctx);
    });

    // 配置控制器文件路由
    vapp.use(router(vapp, {
      root: appPath + '/controller'
    }));

    return {
      host: item,
      app: vapp
    };
}).filter(function(item) {
  return !!item;
});

app.use(vhost(vhosts));


module.exports = app;