'use strict'

const debug = require('debug')('koa-grace:views');
const error = require('debug')('koa-grace-error:views');
const path = require('path');
const views = require('./lib/views.js');

/**
 * Add `render` method.
 *
 * @param {Object} opts (optional)
 * 
 * @return {Function}
 *
 * @todo 添加测试用例
 */

module.exports = function graceViews(opts) {
  // 使用默认配置
  const config = Object.assign({
    // 模板文件根目录
    root: '',
    // 模板文件后缀
    extension: 'html',
    // 默认使用的模板引擎
    engine: 'nunjucks',
    // 默认的模板参数
    locals: {},
    // 是否使用缓存，默认不使用
    cache: false
  }, opts);

  // 获取模板引擎
  const render = views(config)

  return async function views(ctx, next) {
    if (ctx.render) return await next();

    Object.assign(ctx, {
      render: function(tpl, data) {
        if (typeof tpl !== 'string') return error(`Illegal tpl path：${tpl} !`);

        if (!path.extname(tpl)) {
          tpl += `.${config.extension}`
        }

        tpl = path.resolve(config.root, tpl);

        return new Promise((resolve) => {
          render(tpl, data).then((html) => {
            ctx.type = 'text/html';
            ctx.body = html;
            resolve(html);
          })
        });
      }
    })

    await next();
  }
}
