"use strict";
var path = require('path')

var env = process.env.NODE_ENV || 'development'
var port = process.env.PORT || 3000

var DEBUG = env !== 'production'

module.exports = {
  // controller中请求各类数据前缀和域名的键值对
  api: {},

  // 站点相关的配置
  site: {
    name: "koa-hornbill",
    keys: ['d715025d4a566a1112c82063b60aa4de13ecd550'],
    env: env,
    port: port
  },

  // 站点相关的配置
  path: {
    // project
    project: './example/'
  },

  // vhost配置
  vhost: {
    'blog.com':'blog',
    'localhost':'blog',
    '127.0.0.1':'shop',
    '0.0.0.0':'reactjs-boilerplate'
  }
}