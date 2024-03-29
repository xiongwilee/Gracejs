'use strict';

const Stream = require('stream');
const Request = require('request');
const debug = require('debug')('gracejs:proxy');
const error = require('debug')('gracejs-error:proxy');

/**
 * request包装成promise函数
 * @param  {Object}  ctx 上下文
 * @param  {Object}   param    参数
 *         {Boolean}   param.needPipeRes 是否需要pipe response
 * @param  {Object}   options  Request配置项
 * @param  {Function} callback 回调函数
 */
module.exports = function request(ctx, param, options, callback) {
  callback = callback || (() => {});

  // 获取request参数
  let opt = Object.assign({
    gzip: true, //是否gzip
    timeout: 15000 // 超时时间
  }, options);

  debug('proxying : ' + opt.uri);

  // 重试配置：允许重试，且能重试的次数
  // 设为0则为不允许重试
  let retryNum = 1;

  /**
   * 创建请求
   * @return {Object} 请求对象
   */
  function _createReq(resolve) {
    let startTime = new Date();
    return Request(opt, (err, httpResponse, data) => {

      let status = httpResponse && httpResponse.statusCode || 'NULL',
        duration = (new Date() - startTime) + 'ms',
        info = { status: status, duration: duration };

      // 请求出错
      if (err) {
        err.status = status;
        err.duration = duration;
        error('proxy error : ' + opt.uri, err);

        resolve(callback(httpResponse, data || err));
        return;
      }

      // 有正常的返回数据 或 method为HEAD
      // 因为method的head的请求只会返回请求头不会返回请求体
      if (data || ctx.method === 'HEAD') {
        debug('proxy success : ' + opt.uri, info);

        resolve(callback(httpResponse, data));
        return;
      }

      // 没有报错，但是也没有正常返回的数据
      // 根据重试配置进行重试,
      if (retryNum > 0) {
        debug(`proxy retry: Request ${opt.uri} no response, retry ${retryNum} times!`, info);
        retryNum--;
        return _createReq(resolve);
      } else {
        error(`proxy error: Request ${opt.uri} no response!`, info);

        resolve(callback(httpResponse, {
          code: 'NULL',
          message: 'No response data!'
        }));
      }
    });
  }

  return new Promise((resolve) => {
    // 发送请求
    let ProxyServer = _createReq(resolve);


    // 如果ctx.req.readable是可读的而且当前请求不为GET
    // 则可以pipe
    if (ctx.req.readable && ctx.method !== 'GET') {
      ctx.req.pipe(ProxyServer);
    }

    if (param.needPipeRes) {
      // 参考：https://github.com/koajs/koa/blob/master/docs/api/response.md#stream
      // 具体原理为：ProxryServer 在 requestjs 内部已经有消费的监听事件，导致倍转成一个paused模式的可读流
      // 这里通过PassThrough方法转换成一个flowing的可读流，再赋值给ctx.body，以避免数据丢失
      ctx.body = ProxyServer.pipe(Stream.PassThrough());
    }
  });
};
