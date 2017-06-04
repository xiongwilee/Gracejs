'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const views = require('../index');

const app = new Koa()

app.use(views({
  root: path.resolve(__dirname, './views'),
  extension: 'html',
  locals: {
    constant: {
      test: 'testtest'
    }
  }
}, {
  noCache: true
}, (env) => {}))

app.use(async(ctx, next) => {
  await ctx.render('test.html', {
    data: 'hello world!'
  });
  await next();
});

module.exports = http.createServer(app.callback());
