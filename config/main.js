"use strict";
var path = require('path')

var env = process.env.NODE_ENV || 'development'
var port = process.env.PORT || 3000

var DEBUG = env !== 'production'

module.exports = {
  //http://koajs.com/#application
  api: {},
  site: {
    name: "koa-hornbill",
    keys: ['d715025d4a566a1112c82063b60aa4de13ecd550'],
    env: env,
    port: port
  },
  path: {
    project: './example/'
  },
  vhost: {
    '127.0.0.1':'shop',
    'localhost':'order',
    '0.0.0.0':'reactjs-boilerplate'
  }
}