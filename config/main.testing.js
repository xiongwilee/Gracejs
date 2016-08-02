/**
 * 测试环境配置文件
 */

"use strict";

const serverConfig = require('./server.json');
const replace = require('./replace');
process.env.DEBUG = process.env.DEBUG || 'koa-grace*';

module.exports = replace({
  // vhost配置
  vhost: {},

  // proxy timeout时间
  proxy: {
    timeout: 15000
  },

  // controller中请求各类数据前缀和域名的键值对
  api: {},

  // mock server配置
  mock: {
    prefix: '/__MOCK__/'
  },

  // 站点相关的配置
  site: {
    env: 'testing',
    port: '${port}',
    // 办公网络IP
    ips: [],
    hostname: '${hostname}'
  },

  // 通用参数，以模板参数的形式传递给模板引擎
  constant: {
    cdn: "",
    domain: {}
  },

  // 路径相关的配置
  path: {
    // project
    project: '../app/',
    default_path: {
      platform: '/home',
    },
    default_jump: {}
  },

  // mongo配置
  mongo: {
    options: {
      // mongoose 配置
    },
    api: {}
  },

  // 模板引擎配置
  template: {
    wallet: 'ect'
  },

  xload: {
    path: 'files/',
    upload: {
      encoding: 'utf-8',
      maxFieldsSize: 2 * 1024 * 1024,
      maxFields: 1000,
      keepExtensions: true
    },
    download: {}
  },

  // eagle
  eagle: {
    env : 'testing',
    // 统计数据的接口
    dist: '',
    // 发送统计的间隔时间，
    time: 10000,
    // sentry 统计的地址
    dsn: '',
    // 当前机器的hostname
    hostname: '${hostname}',
    // 需要注入的头信息
    headers: {
      'X-Server': '${hostname}'
    }
  }
}, serverConfig);
