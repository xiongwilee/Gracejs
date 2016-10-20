'use strict';

const assert = require('assert');
const debug = require('debug')('koa-grace:vhost');
const compose = require('koa-compose');

module.exports = function graceVhost(host, app) {
  assert.ok(!!host, 'at least need a vhost');

  let vhosts = [];

  // {
  //     host: 'www.example.com',
  //     app: koaapp
  // }
  if (host.host && host.app) {
    host = host.host;
    app = host.app;
  }

  // 'www.example.com', koaapp
  if (checkParams(host, app)) {
    vhosts.push({
      host: host,
      app: app
    });
  } else if (checkHost(host)) {
    vhosts = host;
  }

  if (!vhosts.length) throw new Error('vhost error');

  // compose the app's middleware to one middleware
  vhosts.forEach((vhost) => {
    debug('register vhost: %s', vhost.host);
    vhost.middleware = compose(vhost.app.middleware);
  });

  // 用以缓存vhost记录
  let HOST_CACHE = {};
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
      debug('there is no host match to ' + ctx.request.headers.host + ctx.request.url);
      ctx.body = 'error: there is no host matched!';

      return await next();
    }

    // merge curHost.app.context to current context
    Object.assign(ctx, curHost.app.context);

    return await curHost.middleware.call(ctx, ctx, next);
  }
};

function isRegExp(obj) {
  return obj.constructor && obj.constructor.name === 'RegExp';
};

function checkParams(host, app) {
  return (typeof host === 'string' || isRegExp(host)) && app && app.middleware && Array.isArray(app.middleware);
};

function checkHost(host) {

  if (!Array.isArray(host)) {
    return false;
  }

  return host.every(function(vhost) {

    var ret = !!vhost && checkParams(vhost.host, vhost.app);

    debug('vhost: %s check %s', vhost.host, ret ? 'success' : 'failed');

    return ret;
  });
};
