'use strict';

const koaSession = require('koa-session');

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
  app.keys = app.keys || ['GRACE-SESSKEY'];

  return koaSession(options, app)
}
