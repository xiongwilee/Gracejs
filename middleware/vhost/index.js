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
    let host = ctx.hostname;

    let curHost = HOST_CACHE[host];
    if (!curHost) {
      vhosts.some((item) => {
        if (item.host === host || (isRegExp(item.host) && item.host.test(host))) {
          curHost = HOST_CACHE[host] = item;
          debug('matched host: %s', item.host);
          return true;
        }
        return false;
      });
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
