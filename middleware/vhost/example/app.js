'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const router = require('../../router/index');
const vhost = require('../index');

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
