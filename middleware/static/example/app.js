'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const _static = require('../index');

const app = new Koa()

app.use(_static(['/static/**/*', '/*/static/**/*'], {
  dir: path.resolve(__dirname, './app/'),
  maxage: 60 * 60 * 1000
}))

module.exports = http.createServer(app.callback());