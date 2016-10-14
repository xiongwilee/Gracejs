'use strict';

import http from 'http'
import Koa from 'koa'
import body from '../index'

const app = new Koa()

app.use(body())

app.use(async (ctx, next) => {
  ctx.body = ctx.request.body || 'no body!';
  await next();
});

module.exports = http.createServer(app.callback());
