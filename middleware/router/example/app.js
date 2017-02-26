'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const router = require('../index');

const app = new Koa()

app.use(router(app, {
  root: path.resolve(__dirname, './controller'),
  default_path: '/index',
  default_jump: true,
  domain: '127.0.0.1',
  errorPath: '/error/404'
}))

module.exports = http.createServer(app.callback());
