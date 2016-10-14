'use strict'

/**
 * Module dependencies.
 */

const debug = require('debug')('koa-grace:views')
const dirname = require('path').dirname
const extname = require('path').extname
const fmt = require('util').format
const join = require('path').join
const cons = require('./lib/views.js')
const fs = require('fs')

/**
 * init config
 */
let config = global.config || {}
config.constant = config.constant || {};

/**
 * Add `render` method.
 *
 * @param {String} path
 * @param {Object} opts (optional)
 * 
 * @return {Function}
 *
 * @todo 添加测试用例
 */

 module.exports = function graceViews(path, opts) {
  opts = Object.assign(opts || {}, {
    extension: 'html'
  });

  debug('options: %j', opts)

  return async function views(ctx, next) {
    if (ctx.render) return await next();

    let render = cons(path, opts)

    /**
     * Render `view` with `locals` and `koa.ctx.state`.
     *
     * @param {String} view
     * @param {Object} locals
     * @return {GeneratorFunction}
     * @api public
     */

    Object.assign(ctx, {
      render: function(relPath, locals) {
        locals = locals || {}

        Object.assign(locals, {
          constant: config.constant
        });

        let state = ctx.state ? Object.assign(locals, ctx.state) : {};

        let ext = (extname(relPath) || '.' + opts.extension).slice(1);
        let paths = getPaths(path, relPath, ext)

        debug('render `%s` with %j', paths.rel, state)

        return new Promise((resolve) => {
          render(paths.rel, state).then((html) => {
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


/**
 * to file
 * @param  {String} fileName 文件名称
 * @param  {String} ext      文件后缀
 * @return {String}          完整文件名
 */
function toFile(fileName, ext) {
  return `${fileName}.${ext}` 
}

/**
 * Get the right path, respecting `index.[ext]`.
 * @param  {String} abs absolute path
 * @param  {String} rel relative path
 * @param  {String} ext File extension
 * @return {Object} tuple of { abs, rel }
 */

function getPaths(abs, rel, ext) {
  try {
    const stats = fs.statSync(join(abs, rel))
    if (stats.isDirectory()) {
      // a directory
      return {
        rel: join(rel, toFile('index', ext)),
        abs: join(abs, dirname(rel), rel)
      }
    }

    // a file
    return { rel, abs }
  } catch (e) {
    // not a valid file/directory
    return {
      rel: toFile(rel, ext),
      abs: toFile(abs, ext)
    }
  }
}
