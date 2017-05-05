'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const body = require('../../body/index');
const xload = require('../../xload/index');
const router = require('../../router/index');
const proxy = require('../index');

const app = new Koa()

app.use(body());

app.use(xload(app, {
  path: './data'
}));

app.use(proxy(app, {
  github: 'https://avatars.githubusercontent.com/',
  local: 'http://127.0.0.1:3001/',
  baidu: 'https://www.baidu.com/',
  test: 'http://test.com/'
}, {
  timeout: 15000, // 超时时间
  allowShowApi: true
}));

app.use(router(app, {
  root: path.resolve(__dirname, './controller'),
  default_path: '/index',
  default_jump: true,
  domain: '127.0.0.1',
  errorPath: '/error/404'
}))

module.exports = http.createServer(app.callback());
