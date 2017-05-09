'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const xload = require('../index');

const app = new Koa()

// 配置api
app.use(xload(app, {
  path: path.resolve(__dirname, './data'),
  upload: {
    /*
        encoding: 'utf-8',
        maxFieldsSize: 2 * 1024 * 1024,
        maxFields: 1000*/
  },
  download: {
  }
}));

app.use(async(ctx, next) => {
  let data;

  // 数据请求
  if (ctx.path == '/download') {
    let path = ctx.query['file'] || '1.pic.jpg';
    await ctx.download(path);
    return;
  } else if (ctx.path == '/upload') {
    ctx.body = await ctx.upload();
    return;
  }


  ctx.body = '' +
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
    '<input type="text" name="title"><br>' +
    '<input type="file" name="upload1" multiple="multiple"><br>' +
    '<input type="file" name="upload2" multiple="multiple"><br>' +
    '<input type="submit" value="Upload">' +
    '</form>';

  await next();
});

module.exports = http.createServer(app.callback());
