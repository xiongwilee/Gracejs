'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const views = require('../index');

const app = new Koa()

app.use(views({
  root: path.resolve(__dirname, './views'),
  extension: 'html',
  engine: 'swiger',
  locals: {},
  cache: 'memory'
}))

app.use(async(ctx, next) => {
  await ctx.render('test', {
    data: 'hello world!'
  });
  await next();
});

module.exports = http.createServer(app.callback());
