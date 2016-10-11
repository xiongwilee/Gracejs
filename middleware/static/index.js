'use strict';

const path = require('path');
const debug = require('debug')('koa-grace:static');
const send = require('koa-send');
const minimatch = require('minimatch');

/**
 * 生成路由控制
 * @param {String} prefix url prefix
 * @param {Object} options 配置项
 * @param {String} options.dir koa-grace app dir
 * @param {object} options.maxage options.maxage config
 * 
 * @return {function}     
 *   
 * @todo COMBO静态文件的功能
 * @todo 需要添加测试用例
 */
module.exports = function _static(prefix, options) {
  let PATH_CACHE = {};

  return async function(ctx, next) {

    let curPath = ctx.path;
    let filePath = matchPath(prefix, curPath);

    if (!filePath) {
      return await next();
    }

    debug(path.resolve(options.dir + filePath));
    await send(ctx, filePath, { 
      root: options.dir, 
      maxage: options.maxage 
    });

    // 如果发现是静态文件，直接交回执行权限即可，不用执行下一个中间件
    // return yield * next;
  }

  /**
   * 匹配路由并做记录
   * @param  {Array|String} prefix 匹配规则
   * @param  {String}       path   url path
   */
  function matchPath(prefix, path) {
    // 如果缓存存在，则直接返回结果
    if (PATH_CACHE[path]) {
      return PATH_CACHE[path];
    }

    // 如果匹配规则是一个String则直接匹配
    if (typeof prefix == 'string') {
      let match = minimatch(path, prefix);
      if (!match) {
        return false;
      }

      PATH_CACHE[path] = formatPath(prefix, path);

      return PATH_CACHE[path];
    }

    // 如果匹配规则不是String则只能是Array
    if (!prefix.length || prefix.length < 1) {
      return false;
    }

    for (let i = 0; i < prefix.length; i++) {
      let match = minimatch(path, prefix[i]);
      if (match) {
        PATH_CACHE[path] = formatPath(prefix[i], path);
        return PATH_CACHE[path];
      }
    }

    return false;
  }

  /**
   * 把 []
   * @param  {[type]} pattern [description]
   * @param  {[type]} path    [description]
   * @return {[type]}         [description]
   */
  function formatPath(pattern, path) {
    let prefix = pattern.replace(/(\/\*\*|\/\*)/g, '');
    return path.replace(prefix, '').replace(/(\/[a-zA-Z-_]+)/, '$1' + prefix);
  }
}
