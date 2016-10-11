'use strict';

const genericSession = require('koa-generic-session');
const redisStore = require('koa-redis');

/**
 * gracejs获取session中间件
 * @param  {Object} app     app
 * @param  {Object} options 配置
 * @return {Object}         promise
 *
 * @todo 测试用例
 */
module.exports = function session(app, options) {
  options = options || {};
  
  app.keys = app.keys || ['koa-grace', 'koa-grace-session'];

  if (options.redis) {
    options.store = redisStore(options.redis)
  }

  return genericSession(options)
}
