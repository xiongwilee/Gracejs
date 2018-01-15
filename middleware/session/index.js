'use strict';

const debug = require('debug')('koa-session');
const ContextSession = require('./lib/context');
const util = require('./lib/util');
const assert = require('assert');
const uid = require('uid-safe');
const is = require('is-type-of');

const CONTEXT_SESSION = Symbol('context#contextSession');
const _CONTEXT_SESSION = Symbol('context#_contextSession');


/**
 * gracejs获取session中间件
 * @param  {Object} app     app
 * @param  {Object} options 配置
 * @return {Object}         promise
 *
 * @todo 测试用例
 */
module.exports = function(app, opts) {

  opts = formatOpts(opts);
  extendContext(app.context, opts);

  return async function session(ctx, next) {
    const sess = ctx[CONTEXT_SESSION];
    if (sess.store) await sess.initFromExternal();
    try {
      await next();
    } catch (err) {
      throw err;
    } finally {
      await sess.commit();
    }
  };
};

/**
 * format and check session options
 * @param  {Object} opts session options
 * @return {Object} new session options
 *
 * @api private
 */

function formatOpts(opts) {
  opts = opts || {};
  // key
  opts.key = opts.key || 'koa:sess';

  // back-compat maxage
  if (!('maxAge' in opts)) opts.maxAge = opts.maxage;

  // defaults
  if (opts.overwrite == null) opts.overwrite = true;
  if (opts.httpOnly == null) opts.httpOnly = true;
  if (opts.signed == null) opts.signed = true;

  debug('session options %j', opts);

  // setup encoding/decoding
  if (typeof opts.encode !== 'function') {
    opts.encode = util.encode;
  }
  if (typeof opts.decode !== 'function') {
    opts.decode = util.decode;
  }

  const store = opts.store;
  if (store) {
    assert(is.function(store.get), 'store.get must be function');
    assert(is.function(store.set), 'store.set must be function');
    assert(is.function(store.destroy), 'store.destroy must be function');
  }

  const ContextStore = opts.ContextStore;
  if (ContextStore) {
    assert(is.class(ContextStore), 'ContextStore must be a class');
    assert(is.function(ContextStore.prototype.get), 'ContextStore.prototype.get must be function');
    assert(is.function(ContextStore.prototype.set), 'ContextStore.prototype.set must be function');
    assert(is.function(ContextStore.prototype.destroy), 'ContextStore.prototype.destroy must be function');
  }

  if (!opts.genid) {
    if (opts.prefix) opts.genid = () => opts.prefix + uid.sync(24);
    else opts.genid = () => uid.sync(24);
  }

  return opts;
}

/**
 * extend context prototype, add session properties
 *
 * @param  {Object} context koa's context prototype
 * @param  {Object} opts session options
 *
 * @api private
 */

function extendContext(context, opts) {
  Object.defineProperties(context, {
    [CONTEXT_SESSION]: {
      get() {
        if (this[_CONTEXT_SESSION]) return this[_CONTEXT_SESSION];
        this[_CONTEXT_SESSION] = new ContextSession(this, opts);
        return this[_CONTEXT_SESSION];
      },
      enumerable: true
    },
    session: {
      get() {
        return this[CONTEXT_SESSION].get();
      },
      set(val) {
        this[CONTEXT_SESSION].set(val);
      },
      configurable: true,
      enumerable: true
    },
    sessionOptions: {
      get() {
        return this[CONTEXT_SESSION].opts;
      },
      enumerable: true
    },
  });
}
