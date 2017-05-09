'use strict';

const path = require('path')
const http = require('http')
const Koa = require('koa')
const proxy = require('../../proxy/index')
const mock = require('../index')

const app = new Koa()

// 配置mock
app.use(mock(app, {
  root: path.resolve(__dirname, './test/mock'),
  NODE_ENV: 'development',
  prefix: '/__MOCK__/test/'
}));

// 配置api
app.use(proxy(app, {
  test: 'http://127.0.0.1:3001/__MOCK__/test/'
}));

app.use(async(ctx, next) => {
  if (ctx.path == '/download') {
    
  }
  await ctx.proxy({
    data1: 'test:test1',
    data2: 'test:test2/test3?test=test',
    data3: 'test:test4/test5/test6?test=test',
  });
  
  ctx.body = ctx.backData || 'test';

  await next();
});

module.exports = http.createServer(app.callback());
