'use strict';

import path from 'path'
import http from 'http'
import Koa from 'koa'
import body from '../../body/index'
import router from '../../router/index'
import proxy from '../index'

const app = new Koa()

app.use(body());

app.use(proxy(app, {
  github: 'https://avatars.githubusercontent.com/',
  local: 'http://127.0.0.1:3001/',
  test: 'http://192.168.1.10:10086/'
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

