'use strict';

const http = require('http');
const Koa = require('koa');
const body = require('../index');

const app = new Koa()

app.use(body())

app.use(async (ctx, next) => {
  ctx.body = ctx.request.body || 'no body!';
  await next();
});

module.exports = http.createServer(app.callback());
