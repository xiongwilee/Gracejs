'use strict'

const debug = require('debug')('koa-grace:views');
const error = require('debug')('koa-grace-error:views');
const path = require('path');
const fs = require('fs');
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
  // 用以缓存模板引擎路径匹配
  const TPL_MATCH = {};

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

        const tplPath = getPath(tpl, config);

        return new Promise((resolve) => {
          render(tplPath, data).then((html) => {
            ctx.type = 'text/html';
            ctx.body = html;
            resolve(html);
          })
        });
      }
    })

    await next();
  }

  /**
   * 获取真实的文件绝对路径
   * @param  {String} tpl    文件路径
   * @param  {Object} config 文件配置
   * @return {String}        返回获取到的文件路径
   */
  function getPath(tpl, config) {
    const defaultExt = config.extension;
    const tplAbsPath = path.resolve(config.root, tpl);

    if (TPL_MATCH[tplAbsPath]) return TPL_MATCH[tplAbsPath];

    let tplExt = path.extname(tpl);
    // 如果有后缀名，且等于默认后缀名，则直接返回
    if (tplExt && tplExt === defaultExt) {
      return TPL_MATCH[tplAbsPath] = tplAbsPath;
    }

    try {
      let stats = fs.statSync(tplAbsPath);
      // 如果当前是一个文件目录，则返回： 文件目录 + index.html
      if (stats.isDirectory()) {
        return TPL_MATCH[tplAbsPath] = path.resolve(tplAbsPath, `index.${defaultExt}`)
      }

      // 否则是一个文件路径，直接返回 tplAbsPath
      return TPL_MATCH[tplAbsPath] = tplAbsPath

    } catch (err) {
      // 进入报错，则说明文件找不到，直接返回自动添加文件名的情况
      return TPL_MATCH[tplAbsPath] = `${tplAbsPath}.${defaultExt}`
    }

  }
}
