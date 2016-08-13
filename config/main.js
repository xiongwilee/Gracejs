/**
 * 默认配置文件
 */

"use strict";

let env = process.env.NODE_ENV || 'development';

module.exports = {
  // 扩展配置文件路径 配置文件名分别为：
  //  * main.development.js 开发环境
  //  * main.testing.js 测试环境
  //  * main.production.js 生产环境
  extend: './config/',
  
  // proxy timeout时间
  proxy: {
    timeout: 15000
  },

  // controller中请求各类数据前缀和域名的键值对
  api: {
    github_api: 'https://api.github.com/',
    github: 'https://github.com/'
  },

  // 站点相关的配置
  site: {
    env: env,
    port: process.env.PORT || 3000
  },

  // 路径相关的配置
  path: {
    // project
    project: './app/',
    default_path: {
      blog: '/home'
    }
  },

  // vhost配置
  vhost: {
    'test.mlsfe.biz': 'blog',
    '127.0.0.1': 'blog'
  },

  // mongo配置
  mongo: {
    options: {
      // mongoose 配置
    },
    api: {
      'blog': 'mongodb://localhost:27017/blog'
    }
  },

  // 模板引擎配置
  template: 'swig',

  xload: {
    path: 'files/',
    upload: {
      encoding: 'utf-8',
      maxFieldsSize: 2 * 1024 * 1024,
      maxFields: 1000,
      keepExtensions: true
    },
    download: {}
  }
}
