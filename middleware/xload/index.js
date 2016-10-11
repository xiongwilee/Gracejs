'use strict';

const path = require('path');
const util = require('util');

const formidable = require('./lib/formidable');
const sendfile = require('./lib/sendfile');

/**
 * 
 * @param  {string} app     context
 * @param  {object} options 配置项
 *         {object} options.api api配置项，例如local对应http://localhost:3000，则为：api:{local:'http://localhost:3000'}
 * 
 * @return {function}
 *
 * @todo 完善测试用例
 */
module.exports = function graceXload(app, options) {

  let dir = path.resolve(options.path || './data');

  return async function xload(ctx, next) {
    if (ctx.download) return await next();

    let req = ctx.req;
    let res = ctx.res;

    Object.assign(ctx, {
      upload: function(opt) {
        // 注入配置项
        let config = Object.assign({
          uploadDir: dir,
          encoding: 'utf-8',
          maxFieldsSize: 2 * 1024 * 1024,
          maxFields: 1000,
          keepExtensions: true
        }, options.upload, opt);

        // 执行上传
        return formidable(req, config);
      },
      download: function(filename, opt) {
        // 注入配置项
        let config = Object.assign({
          downloadDir: dir,
        }, options.download, opt);

        let userAgent = (ctx.get('user-agent') || '').toLowerCase();

        // 更新Content-Disposition
        if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
          ctx.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
        } else if (userAgent.indexOf('firefox') >= 0) {
          ctx.set('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename) + '"');
        } else {
          ctx.set('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
        }

        return sendfile(ctx, filename, config);
      }
    });

    await next();
  };
}
