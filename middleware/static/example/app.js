'use strict';

import path from 'path'
import http from 'http'
import Koa from 'koa'
import _static from '../index'

const app = new Koa()

app.use(_static(['/static/**/*', '/*/static/**/*'], {
  dir: path.resolve(__dirname, './app/'),
  maxage: 60 * 60 * 1000
}))

module.exports = http.createServer(app.callback());