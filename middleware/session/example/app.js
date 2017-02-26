'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const router = require('../../router/index');
const session = require('../index');

const app = new Koa()

// 配置api
app.use(session(app));

app.use(router(app, {
  root: path.resolve(__dirname, './controller'),
  domain: '127.0.0.1'
}));

module.exports = http.createServer(app.callback());
