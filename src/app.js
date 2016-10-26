const path = require('path');
const koa = require('koa');

const Middles = require('../middleware/')

/**
 * 生成app
 *
 * @todo 需要将middleware中的node_modules清除到根目录下的package.json中
 * @todo autoload功能加载各个中间件
 *
 * @export app
 */
const app = new koa()

// compress(gzip)
app.use(Middles.compress());

// session配置，默认使用内存，不推荐在生产环境使用
// 生产环境推荐配置redis，参考：https://github.com/koa-grace/koa-grace-session
// 目前SESSION的方案还是基于generator的，暂时注释
// app.use(Middles.session(app, config.session));

// body
app.use(Middles.body());

// 配置静态文件路由
app.use(Middles.static(['/static/**/*', '/*/static/**/*'], {
  dir: config.path.project,
  maxage: config.site.env == 'production' && 60 * 60 * 1000
}));

// 上传下载功能
app.use(Middles.xload(app, config.xload));

// 获取vhost
let vhosts = Object.keys(config.vhost);

// 注入vhost路由
app.use(Middles.vhost(vhosts.map((item) => {
  let vapp = new koa();

  let appName = config.vhost[item];
  let appPath = path.resolve(config.path.project + '/' + appName);

  // 如果在csrf的module名单里才使用csrf防护功能
  config.csrf.module.indexOf(appName) > -1 && vapp.use(Middles.secure(vapp, {
    throw: true
  }))

  // 在开发环境才使用mock数据功能
  config.site.env == 'development' && vapp.use(Middles.mock(vapp, {
    root: appPath + '/mock/',
    prefix: config.mock.prefix + appName
  }))

  // 如果配置了连接数据库
  config.mongo.api[appName] && vapp.use(Middles.mongo(vapp, {
    root: appPath + '/model/mongo',
    connect: config.mongo.api[appName]
  }))

  // 配置api
  vapp.use(Middles.proxy(vapp, config.api, {
    timeout: config.proxy.timeout, // 接口超时时间
    allowShowApi: config.site.env == 'production'
  }));

  // 配置模板引擎
  let template = (typeof config.template == 'object' ? config.template[appName] : config.template);
  vapp.use(Middles.views(appPath + '/views', {
    root: appPath + '/views',
    map: {
      html: template || 'swiger'
    },
    cache: config.site.env == 'production' && 'memory'
  }));

  // 配置控制器文件路由
  vapp.use(Middles.router(vapp, {
    root: appPath + '/controller',
    default_path: config.path.default_path[appName],
    default_jump: config.path.default_jump[appName],
    domain: item,
    errorPath: '/error/404'
  }));

  return {
    host: item,
    app: vapp
  }
})));

module.exports = app;
