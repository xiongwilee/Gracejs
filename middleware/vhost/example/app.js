'use strict';

import path from 'path'
import http from 'http'
import Koa from 'koa'
import router from '../../router/index'
import vhost from '../index'

let app = new Koa();

let vhosts = ['localhost','127.0.0.1/index'];

vhosts = vhosts.map(function(item) {
  try {
    let vapp = new Koa();

    vapp.use(router(app, {
      root: path.resolve(__dirname, '../../router/example/controller'),
      default_path: '/index',
      default_jump: true,
      domain: 'localhost',
      errorPath: '/error/404'
    }));

    return {
      host: item,
      app: vapp
    }
  } catch (e) {
    console.log('vhost error %s', e.message);
    return;
  }
}).filter(function(item) {
  return !!item;
});

app.use(vhost(vhosts));

module.exports = http.createServer(app.callback());
