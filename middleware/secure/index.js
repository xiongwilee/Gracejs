'use strict';

const debug = require('debug')('koa-grace:csrf');
const error = require('debug')('koa-grace-error:csrf');

/**
 * 安全相关的中间件
 * @param  {Object} app  app
 * @param  {Object} opts 配置项
 * @return {Function}      
 *
 * @todo 完善测试用例
 */
module.exports = function graceSecure(app, opts) {

  let options = Object.assign({
    env: 'production',
    excluded: ['GET', 'HEAD', 'OPTIONS'],
    cookie_token: 'grace_token',
    header_token: 'x-grace-token',
    timeout: 30 * 86400 * 1000,
    throw: true
  }, opts);

  return async function secure(ctx, next) {
    
    if (options.excluded.indexOf(ctx.method) == -1) {
      let curSecret = ctx.cookies.get(options.cookie_token);

      // 如果是header的key，则固定为'x-grace-token'
      // 其他如果要获取参数，则为配置参数值
      let curToken = (ctx.headers && ctx.headers[options.header_token]) ||
        (ctx.query && ctx.query[options.cookie_token]) ||
        (ctx.request.body && ctx.request.body[options.cookie_token]);

      // token不存在
      if (!curToken || !curSecret) {
        error('CSRF Token Not Found: ' + ctx.req.url)
        
        options.throw && ctx.throw('CSRF Token Not Found!',403);
        return;
      }

      // token校验失败
      if (!verifyToken(curSecret, curToken)) {
        error('CSRF token Invalid: ' + ctx.req.url)

        options.throw && ctx.throw('CSRF token Invalid!',403)
        return;
      }
    }

    await next();

    // token: 当前token的的content，不需要httpOnly
    ctx.cookies.set(options.cookie_token, randomGen(), {
      maxAge: options.timeout,
      httpOnly: false
    })
  }

  /**
   * 判断token是否正确
   * @param  {String} secret 密钥
   * @param  {String} token  
   * @return {Boolean}        
   */
  function verifyToken(secret, token){
    return secret === token
  }

  /**
   * 获取随机字符串
   * @return {String} 随机字符串
   */
  function randomGen (){
    return Math.random().toString(36).substr(2).toUpperCase()
  }
}
