'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const views = require('../index');

const app = new Koa()

app.use(views(app, {
  root: path.resolve(__dirname, './views'),
  extension: 'html',
  engine: 'nunjucks',
  locals: {},
  cache: true,
  debug: true
}))

app.use(async(ctx, next) => {
  ctx.defaultCtrlData = {
    defaultData: 'this is defaultCtrlData'
  }
  await ctx.render('test.html', {
    data: 'hello world!',
    data1: { test1: 'test1' }
  });
  await next();
});

module.exports = http.createServer(app.callback());