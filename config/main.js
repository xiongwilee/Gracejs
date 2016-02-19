"use strict";

var env = process.env.NODE_ENV || 'development'
var port = process.env.PORT || 3000

var DEBUG = env !== 'production'

module.exports = {
  // controller中请求各类数据前缀和域名的键值对
  api: {
    github_api:'https://api.github.com/',
    github:'https://github.com/'
  },

  // 站点相关的配置
  site: {
    env: env,
    debug: DEBUG,
    port: port
  },

  // 路径相关的配置
  path: {
    // project
    project: './app/',
    default_path:{
      blog:'/home'
    }
  },

  // vhost配置
  vhost: {
    '127.0.0.1':'blog',
    'localhost':'shop',
    '0.0.0.0':'reactjs-boilerplate'
  },

  // mongo配置
  mongo: {
    'blog': 'mongodb://localhost:27017/blog'
  },

  // 模板引擎配置
  template: 'swig'
}