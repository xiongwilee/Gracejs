'use strict';

import http from 'http'
import Koa from 'koa'
import compress from '../index'

const app = new Koa()

app.use(compress())



module.exports = http.createServer(app.callback());
