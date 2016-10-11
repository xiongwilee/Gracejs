'use strict';

import path from 'path'
import http from 'http'
import Koa from 'koa'
import router from '../../router/index'
import mongo from '../index'

const app = new Koa()

app.use(mongo(app, {
  connect:'mongodb://localhost:27017/blog',
  root:path.resolve(__dirname, './model/mongo')
}))

app.use(router(app, {
  root: path.resolve(__dirname, './controller')
}));

module.exports = http.createServer(app.callback());