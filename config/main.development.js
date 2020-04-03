'use strict';

process.env.DEBUG = process.env.DEBUG || '*';

module.exports = {
  // vhost配置
  vhost: {
    '127.0.0.1': 'demo',
    'localhost': 'blog',
    'feclub.cn': 'blog',
    'localhost/test': 'test',
    '0.0.0.0': 'iblog'
  },

  // router配置
  router: {
    prefix: {
      test: '/test'
    }
  },

  // proxy配置
  proxy: {
    // 超时配置 
    timeout: 15000,
    //指定当前代理请求是否使用keepAlive形式，如果为true，将覆盖原请求header里面的keepAlive参数，否则不影响原请求header里面的keepAlive参数
    //默认为true，实际项目中bff层一般与后端的微服务部署在内网，做成长链接后，提升性能的同时也不会造成对微服务端的资源浪费，因为一般是一个端对应一个bff，数量可控；
    keepAlive:true
  },

  // controller中请求各类数据前缀和域名的键值对
  api: {
    github_api: 'https://api.github.com/',
    github: 'https://github.com/',
  },

  // mock server配置
  mock: {
    prefix: '/__MOCK__/',
    localServer: 'http://127.0.0.1:3000',
    isFullMock: false
  },

  // 站点相关的配置
  site: {
    env: 'development',
    port: 3000,
    hostname: 'localhost'
  },

  // 通用参数，以模板参数的形式传递给模板引擎
  constant: {
    cdn: '',
    domain: {
      demo: 'http://127.0.0.1:3000'
    }
  },

  // 路径相关的配置
  path: {
    // project
    project: './app/',
    // 当直接访问域名时的默认路由
    default_path: {
      demo: '/home/index',
      blog: '/home/index',
      iblog: '/home/index'
    },
    // 如果设置jump为false，则当直接访问域名时不重定向到default_path
    default_jump: {
      demo: false,
      blog: false,
      iblog: false
    }
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

  // 模板引擎配置，默认：swiger
  template: {
    iblog: 'nunjucks'
  },

  // 上传文件配置
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

  // csrf配置
  csrf: {
    // 需要进行xsrf防护的模块
    module: []
  },

  // session配置
  session: {
  },

  // 额外参数
  extra: {

  }
};
