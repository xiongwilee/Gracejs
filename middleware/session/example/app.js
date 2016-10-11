'use strict';

import path from 'path'
import http from 'http'
import Koa from 'koa'
import router from '../../router/index'
import session from '../index'

const app = new Koa()

// 配置api
app.use(session(app));

app.use(router(app, {
  root: path.resolve(__dirname, './controller'),
  domain: '127.0.0.1'
}));

module.exports = http.createServer(app.callback());
