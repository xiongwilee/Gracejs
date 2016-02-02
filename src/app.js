'use strict';

const path = require('path'),
  koa = require('koa'),
  router = require('koa-hornbill-router'),
  vhost = require('koa-hornbill-vhost'),
  logger = require('koa-logger'),
  json = require('koa-json'),
  views = require('koa-views'),
  onerror = require('koa-onerror'),
  bodyparser = require('koa-bodyparser'),
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

    // global middlewares
    vapp.use(views('views', {
      root: appPath + '/views',
      default: 'ejs'
    }));

    vapp.use(bodyparser());
    
    vapp.use(json());

    vapp.use(logger());

    vapp.use(koastatic(appPath + '/static'));

    vapp.on('error', function(err, ctx) {
      log.error('server error', err, ctx);
    });

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