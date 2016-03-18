"use strict";

let env = process.env.ENV || 'development';
let port = process.env.PORT || 3000;
let DEBUG = process.env.DEBUG = process.env.DEBUG || 'koa-grace*'

module.exports = {
  // 扩展配置文件
  extend: '../koa-grace-app/config/main.js',
  
  // controller中请求各类数据前缀和域名的键值对
  api: {
    github_api:'https://api.github.com/',
    github:'https://github.com/'
  },

  // 站点相关的配置
  site: {
    env: env,
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
    'test.mlsfe.biz':'blog',
    '127.0.0.1':'blog',
    'localhost':'shop',
    '0.0.0.0':'reactjs-boilerplate'
  },

  // mongo配置
  mongo: {
    options:{
      // mongoose 配置
    },
    api:{
      'blog': 'mongodb://localhost:27017/blog'
    }
  },

  // 模板引擎配置
  template: 'swig'
}