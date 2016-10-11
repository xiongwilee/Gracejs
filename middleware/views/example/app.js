'use strict';

import path from 'path'
import http from 'http'
import Koa from 'koa'
import views from '../index'

const app = new Koa()

app.use(views(path.resolve(__dirname, './views'), {
  root: path.resolve(__dirname, './views'),
  map: {
    html: 'swiger'
  },
  cache: 'memory'
}))

app.use(async(ctx, next) => {
  await ctx.render('test',{
  	data:'hello world!'
  });
  await next();
});

module.exports = http.createServer(app.callback());
