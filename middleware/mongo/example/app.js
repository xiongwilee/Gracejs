'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const router = require('../../router/index');
const mongo = require('../index');

const app = new Koa()

app.use(mongo(app, {
  connect:'mongodb://localhost:27017/blog',
  root:path.resolve(__dirname, './model/mongo')
}))

app.use(router(app, {
  root: path.resolve(__dirname, './controller')
}));

module.exports = http.createServer(app.callback());