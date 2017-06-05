'use strict'

const debug = require('debug')('koa-grace:views');
const error = require('debug')('koa-grace-error:views');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

/**
 */

module.exports = function graceViews(config, opts, onLoadEnv) {
  // 用以缓存模板引擎路径匹配
  const TPL_MATCH = {};

  // 使用默认配置创建loader
  const nunjucksLoader = new nunjucks.FileSystemLoader(config.root);

  // 创建nunjucks执行环境
  const nunjucksEnv = new nunjucks.Environment(nunjucksLoader, Object.assign({
    // 控制输出是否被转义
    autoescape: true,
    // 是否自动去除 block/tag 后面的换行符
    trimBlocks: false,
    // 是否自动去除 block/tag 签名的空格
    lstripBlocks: false,
    // 不使用缓存，每次都重新编译
    noCache: false,
    // 定义模板语法
    tags: {}
  }, opts));

  // 加载env完成之后，回调onLoadEnv方法，可以添加插件
  onLoadEnv && onLoadEnv(nunjucksEnv)

  return async function views(ctx, next) {
    if (ctx.render) return await next();

    Object.assign(ctx, {
      render: function(tpl, data) {
        if (typeof tpl !== 'string') return error(`Illegal tpl path：${tpl} !`);

        const tplPath = getPath(tpl, config);
        const tplData = Object.assign({}, config.locals, data)

        return new Promise((resolve) => {
          nunjucksEnv.render(tplPath, tplData, (err, res) => {
            ctx.type = 'text/html';
            ctx.body = res;
            resolve(res);
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
