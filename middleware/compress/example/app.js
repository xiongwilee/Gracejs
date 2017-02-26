'use strict';

const http = require('http');
const Koa = require('koa');
const compress = require('../index');

const app = new Koa()

app.use(compress())



module.exports = http.createServer(app.callback());
