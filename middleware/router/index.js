'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const router = require('./lib/router');
const debug = require('debug')('koa-grace:router');
const error = require('debug')('koa-grace-error:router');

/**
 * [METHOD_ALLOWED 可以注册的方法]
 * all = ['acl', 'bind', 'checkout', 'connect', 'copy', 'delete', 'get', 'head', 'link', 'lock', 'm-search', 'merge', 'mkactivity', 'mkcalendar', 'mkcol', 'move', 'notify', 'options', 'patch', 'post', 'propfind', 'proppatch', 'purge', 'put', 'rebind', 'report', 'search', 'subscribe', 'trace', 'unbind', 'unlink', 'unlock', 'unsubscribe' ]
 * @all {会注册33个verb, 慎用！！！}
 * delete {作为保留词，推荐使用别称：del}
 */
const METHOD_ALLOWED = ['get', 'post', 'put', 'patch', 'del', 'head', 'delete', 'all'];

/**
 * 生成路由控制
 * @param  {string} app     context
 * @param  {object} options 配置项
 *         {string} options.root controller路径
 *         {string} options.defualt_jump 如果访问路径为纯域名是否做跳转，默认为false
 *         {string} options.default_path 默认路径
 *         {string} options.domain 请求域名,可不传
 * @return {function}       
 *
 * @todo lib/router.js  this.MATCHS 中如果配置的规则路由特别多，内存溢出的风险 
 */
module.exports = function graceRouter(app, options) {
  if (typeof options === 'string') {
    options = { root: options }
  } else if (!options || !options.root) {
    throw new Error('`root` config required.');
  }

  const Router = router(options);
  const Domain = options.domain || '';
  const ctrlRoot = options.root;

  // app的默认路由
  if (options.default_jump !== false && options.default_path) {
    Router.redirect('/', options.default_path);
  }

  // 添加bindDefault方法
  // 如果defaultCtrl文件存在则注入，否则忽略
  const defaultCtrlRoot = options.defaultCtrlRoot || ctrlRoot;
  const defaultCtrlName = options.defaultCtrlName || 'defaultCtrl.js';
  const defaultCtrlPath = path.resolve(defaultCtrlRoot, defaultCtrlName);

  Object.defineProperty(app.context, 'bindDefault', {
    get: () => {
      try {
        return require(defaultCtrlPath);
      } catch (err) {
        return new Promise((resolve) => {
          error(`Cannot find default controller '${defaultCtrlPath}'`)
          resolve();
        })
      }
    },
    configurable: true,
    enumerable: true
  });

  // 需要忽略的文件
  // 默认忽略：node_modules , defaultCtrl文件
  const ignorePath = ['node_modules', defaultCtrlName];

  // 查找root目录下所有文件并生成路由
  glob.sync('**/*.js', {
    root: ctrlRoot,
    cwd: ctrlRoot,
    ignore: `**/+(${ ignorePath.join('|') })/**`,
    absolute: true
  }).forEach((filePath) => {

    let exportFuncs;
    try {
      exportFuncs = require(filePath);
    } catch (err) {
      error(`error: require ${filePath} error ${err}`);

      // 如果获取controller出错，则重置为默认方法
      exportFuncs = function() {
        this.status = 500;
        this.body = 'Controller Require Error!';
      }
    }

    const pathRegexp = formatPath(filePath, ctrlRoot);

    getRoute(exportFuncs, (exportFun, ctrlpath) => {
      setRoute(Router, {
        domain: Domain,
        method: exportFun.__method__,
        regular: exportFun.__regular__,
        suffix: exportFun.__suffix__,
        ctrlpath: ctrlpath,
        ctrl: exportFun
      }, options);
    }, [pathRegexp]);
  });

  return async function graceRouter(ctx, next) {
    await Router.routes()(ctx);
    await next();
  }
};

/**
 * 递归生成路由，层级不超过3级
 * @param  {Object|Function}  exportFuncs 获取到的路由
 * @param  {Array}            ctrlpath    路由记录
 * @return
 */
function getRoute(exportFuncs, cb, ctrlpath, curCtrlname) {
  ctrlpath = ctrlpath || [];

  // 如果当前设置了不是路由，则直接返回
  if (exportFuncs.__controller__ === false) {
    return;
  }

  let totalCtrlname = curCtrlname ? ctrlpath.concat([curCtrlname]) : ctrlpath;

  // 只允许3级路由层级
  if (ctrlpath.length > 3) {
    debug(`嵌套路由对象层级不能超过3级：${totalCtrlname.join('/')}`);
    return;
  }

  // 如果是一个方法就直接执行cb
  if (typeof exportFuncs === 'function') {
    cb(exportFuncs, totalCtrlname);
  } else {
    // 否则进行循环递归查询
    for (let ctrlname in exportFuncs) {
      if (!exportFuncs.hasOwnProperty(ctrlname)) {
        continue
      }

      getRoute(exportFuncs[ctrlname], cb, totalCtrlname, ctrlname);
    }
  }
}

/**
 * 格式化文件路径为koa-router的path
 * @param  {string} filePath 文件路径
 * @param  {string} root     router路径
 * @return {string}          过滤之后的path
 */
function formatPath(filePath, root) {
  let dir = root;

  if (!path.isAbsolute(root)) {
    dir = path.join(process.cwd(), root);
  }

  // 修复windows下的\路径问题
  dir = dir.replace(/\\/g, '/');

  return filePath
    .replace(/\\/g, '/')
    .replace(dir, '')
    .split('.')[0];
}

/**
 * 设置路由
 * @param {string} path 当前文件路径
 * @param {object} config  配置项
 *        {string} config.method 当前请求方法：get,post等
 *        {string} config.regular 参考：https://github.com/alexmingoia/koa-router#nested-routers
 *        {string} config.ctrlname 当前controller名称
 *        {funtion} config.ctrl controller方法
 * @param {Obejct} options grace router配置
 */
function setRoute(Router, config, options) {
  let paths = [];
  let ctrlpath = config.ctrlpath.join('/');

  // 加入当前路由
  paths.push(ctrlpath)

  // 如果当前路由配置方案为不跳转，则设置路由'/'为options.default_path路由
  if (options.default_jump === false && ctrlpath == options.default_path) {
    paths.push('/');
  }

  // 如果设置了URL后缀，则统一添加后缀URL
  let suffix = config.suffix !== false && options.suffix || config.suffix;
  if (suffix) {
    paths.push(ctrlpath + suffix);
  }

  // 如果当前路由是以index结尾，则把其父路由也加入路由
  if (config.ctrlpath.slice(-1)[0] === 'index') {
    let parpath = config.ctrlpath.slice(0, -1).join('/');
    paths.push(parpath);
    suffix && paths.push(parpath + suffix);
  }

  // 如果有regular则加入regular路由
  if (config.regular) {
    let reg = typeof config.regular === 'string' ? (ctrlpath + config.regular) : config.regular;
    paths.push(reg)
  }

  // 如果没有配置method 则默认支持get及post
  let method = ['get', 'post'];
  if (typeof config.method === 'string') {
    METHOD_ALLOWED.indexOf(config.method) > -1 && (method = [config.method]);
  } else if (Array.isArray(config.method)) {
    config.method.every((item) => METHOD_ALLOWED.indexOf(item) > -1) && (method = config.method);
  }

  // 对每一个method，有定义时唯一，默认post/get
  method.forEach((_method) => {
    // 注入路由
    paths.forEach((pathItem) => {
      debug(_method + ':' + config.domain + pathItem);

      Router[_method](pathItem, config.ctrl);
    });
  });

}