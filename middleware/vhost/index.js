'use strict';

const debug = require('debug')('koa-grace:vhost');
const compose = require('koa-compose');

module.exports = function graceVhost(vhosts) {
  // 用以缓存vhost记录
  const HOST_CACHE = {};

  vhosts.forEach((vhost) => {
    debug('register vhost: %s', vhost.host);
    vhost.middleware = compose(vhost.app.middleware);
  });

  return async function vhost(ctx, next) {
    // 当前的hostname,不含端口号
    let host = ctx.hostname;
    // 限制只取第一层级的PATH
    let path = ctx.path.split('/')[1] || '';

    // 获取当前的hostpath
    let hostPath = host + '/' + path;
    let curHost = HOST_CACHE[hostPath];

    if (!curHost) {
      // 设置匹配缓存
      let mapCache;

      vhosts.some((item) => {
        let isSubpath = ~item.host.indexOf('/');

        if (isSubpath && item.host === hostPath) {
          // 如果当前item.host配置是子目录模式，且等于hostPath，则不再往下查找，return true
          mapCache = item;
          return true;
        } else if (!isSubpath && item.host === host) {
          // 如果当前item.host配置不是子目录模式，且等于host，则继续查找更适合的条件，return false
          mapCache = item;
          return false;
        } else {
          return false;
        }
      });

      if (mapCache) {
        curHost = HOST_CACHE[hostPath] = mapCache;
        debug('matched host: %s', mapCache.host);
      }
    }

    if (!curHost) {
      debug(`Invalid hostname ${ctx.request.headers.host}, please check vhost config!`);
      ctx.body = 'Invalid hostname!';

      return await next();
    }

    // 完全拷贝curHost的app.context到ctx中，包括context中定义的可枚举的getter
    completeAssign(ctx, curHost.app.context);

    return await curHost.middleware.call(ctx, ctx, next);
  }

  /**
   * 拷贝所有的属性，包括getter, setter（Object.assign默认情况下不会拷贝getter/setter）
   * 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
   * @param  {Object}    target  目标对象
   * @param  {...[Object]} sources 源对象
   * @return {Object}            拷贝之后目标对象
   */
  function completeAssign(target, ...sources) {
    sources.forEach(source => {
      let descriptors = Object.keys(source).reduce((descriptors, key) => {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
        return descriptors;
      }, {});

      // Object.assign 默认也会拷贝可枚举的Symbols
      Object.getOwnPropertySymbols(source).forEach(sym => {
        let descriptor = Object.getOwnPropertyDescriptor(source, sym);
        if (descriptor.enumerable) {
          descriptors[sym] = descriptor;
        }
      });
      Object.defineProperties(target, descriptors);
    });
    return target;
  }
}