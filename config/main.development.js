/**
 * 开发环境配置文件
 */

"use strict";
const serverConfig = require('./server.json');
const replace = require('./replace');
process.env.DEBUG = process.env.DEBUG || 'koa-grace*';

module.exports = replace({
  // vhost配置
  vhost: {
    // 这个是自己在局域网中的地址，可以在本地、局域网其他机器访问
    // 在 ./server.json 中配置：
    // 
    // 如配置："ip"  : "192.168.9.28"
    //        "folder" : "wallet"
    //        
    // 浏览器中访问需要加上自己启动的接口，如:3000
    '${ip}': '${app}',
    '${domain}': '${app}'
  },

  // proxy timeout时间
  proxy: {
    timeout: 15000
  },

  // controller中请求各类数据前缀和域名的键值对
  api: {
    local: 'http://127.0.0.1:${port}/',
    java: 'http://${ip}:${port}/__MOCK__/public/',
  },

  // mock server配置
  mock: {
    prefix: '/__MOCK__/'
  },

  // 站点相关的配置
  site: {
    env: 'development',
    port: '${port}',
    // 办公网络IP
    ips: [
      '192.168.1-255.1-255',
      '106.39.118.254',
      '61.50.115.202',
      '61.50.115.218',
      '106.39.118.250-254',
      '111.204.207.80-95'
    ],
    hostname: '${hostname}'
  },

  // 通用参数，以模板参数的形式传递给模板引擎
  constant: {
    cdn: "",
    domain: {
      blog: 'http://${ip}:${port}',
      platform: 'http://${ip}:${port}',
      bi: 'http://${ip}:${port}',
      activity: 'http://${ip}:${port}',
      walletPc: 'http://${ip}:${port}',
      wallet: 'http://${ip}:${port}'
    }
  },

  // 路径相关的配置
  path: {
    // app
    app: './app/',
    // project
    project: './app/',
    // 当直接访问域名时的默认路由
    default_path: {
      mob: '/home',
      platform: '/home',
      blog: '/home',
      bi: '/home',
      bi_old: '/home',
      wallet: '/home',
      eagle: '/home/index',
    },
    // 如果设置jump为false，则当直接访问域名时不重定向到default_path
    default_jump: {
      eagle: false
    }
  },

  // mongo配置
  mongo: {
    options: {
      // mongoose 配置
    },
    api: {
    }
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
    env: 'development',
    // 统计数据的接口
    dist: 'http://localhost:${port}/aj/api/analysis',
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
