'use strict';

const path = require('path');
const fs = require('fs');
const router = require('./lib/router');
const debug = require('debug')('koa-grace:router');
const error = require('debug')('koa-grace-error:router');

/**
 * [_routerVerb 可以注册的方法]
 * all = ['acl', 'bind', 'checkout', 'connect', 'copy', 'delete', 'get', 'head', 'link', 'lock', 'm-search', 'merge', 'mkactivity', 'mkcalendar', 'mkcol', 'move', 'notify', 'options', 'patch', 'post', 'propfind', 'proppatch', 'purge', 'put', 'rebind', 'report', 'search', 'subscribe', 'trace', 'unbind', 'unlink', 'unlock', 'unsubscribe' ]
 * @all {会注册33个verb, 慎用！！！}
 * delete {作为保留词，推荐使用别称：del}
 */
const _routerVerb = ['get', 'post', 'put', 'patch', 'del', 'head', 'delete', 'all'];

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

  // app的默认路由
  if (options.default_jump !== false && options.default_path) {
    Router.redirect('/', options.default_path);
  }

  let root = options.root;

  // 如果root不存在则直接跳过
  if (!fs.existsSync(root)) {
    error('error : can\'t find route path ' + root);
    return function* ctrl(next) { yield next; };
  }

  _ls(root).forEach((filePath) => {
    if (!/([a-zA-Z0-9_\-]+)(\.js)$/.test(filePath)) {
      return;
    }

    try {
      var exportFuncs = require(filePath);
    } catch (err) {
      error(`error: require ${filePath} error ${err}`);
      return;
    }

    let pathRegexp = _formatPath(filePath, root);

    getRoute(exportFuncs, (exportFun, ctrlpath) => {
      _setRoute(Router, {
        domain: Domain,
        method: exportFun.__method__,
        regular: exportFun.__regular__,
        ctrlpath: ctrlpath,
        ctrl: exportFun
      }, options);
    }, [pathRegexp]);
  });

  // 添加bindDefault方法
  // 如果defaultCtrl文件存在则注入，否则忽略
  let defaultCtrlRoot = options.defaultCtrlRoot || options.root;
  let defaultCtrlPath = path.resolve(defaultCtrlRoot, 'defaultCtrl.js')
  app.context.__defineGetter__("bindDefault", () => {
    try {
      return require(defaultCtrlPath);
    } catch (err) {
      return new Promise((resolve) => {
        error(`Cannot find default controller '${defaultCtrlPath}'`)
        resolve();
      })
    }
  });

  return async function graceRouter(ctx, next) {
    await Router.routes()(ctx, next);
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
 * 查找目录中的所有文件
 * @param  {string} dir       查找路径
 * @param  {init}   _pending  递归参数，忽略
 * @param  {array}  _result   递归参数，忽略
 * @return {array}            文件list
 */
function _ls(dir, _pending, _result) {
  _pending = _pending ? _pending++ : 1;
  _result = _result || [];

  if (!path.isAbsolute(dir)) {
    dir = path.join(process.cwd(), dir);
  }

  // if error, throw it
  let stat = fs.lstatSync(dir);

  if (stat.isDirectory()) {
    let files = fs.readdirSync(dir);
    files.forEach(function(part) {
      _ls(path.join(dir, part), _pending, _result);
    });
    if (--_pending === 0) {
      return _result;
    }
  } else {
    _result.push(dir);
    if (--_pending === 0) {
      return _result;
    }
  }
};

/**
 * 格式化文件路径为koa-router的path
 * @param  {string} filePath 文件路径
 * @param  {string} root     router路径
 * @return {string}          过滤之后的path
 */
function _formatPath(filePath, root) {
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
function _setRoute(Router, config, options) {
  let paths = [];
  // let method = config.method || 'get';
  let method = (_routerVerb.indexOf(config.method) > -1) ? [config.method] : ['get', 'post'];
  let ctrlpath = config.ctrlpath.join('/');

  // 加入当前路由
  paths.push(ctrlpath)

  // 如果当前路由配置方案为不跳转，则设置路由'/'为options.default_path路由
  if (options.default_jump === false && ctrlpath == options.default_path) {
    paths.push('/');
  }

  // 如果当前路由是以index结尾，则把其父路由也加入路由
  if (config.ctrlpath.slice(-1)[0] === 'index') {
    let parpath = config.ctrlpath.slice(0, -1);
    paths.push(parpath.join('/'));
  }

  // 如果有regular则加入regular路由
  if (config.regular) {
    let reg = typeof config.regular === 'string' ? (ctrlpath + config.regular) : config.regular; 
    paths.push(reg)
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
