/**
 * RESTful resource routing middleware for koa.
 *
 * @author Alex Mingoia <talk@alexmingoia.com>
 * @link https://github.com/alexmingoia/koa-router
 */
'use strict';

const debug = require('debug')('koa-router');
const HttpError = require('http-errors');
const co = require('co');
const methods = require('methods');
const Layer = require('./layer');

/**
 * @module koa-router
 */

module.exports = Router;

/**
 * Create a new router.
 *
 * @example
 *
 * Basic usage:
 *
 * ```javascript
 * var app = require('koa')();
 * var router = require('koa-router')();
 *
 * router.get('/', function *(next) {...});
 *
 * app
 *   .use(router.routes())
 *   .use(router.allowedMethods());
 * ```
 *
 * @alias module:koa-router
 * @param {Object=} opts
 * @param {String=} opts.prefix prefix router paths
 * @constructor
 */

function Router(opts) {
  if (!(this instanceof Router)) {
    return new Router(opts);
  }

  this.opts = opts || {};
  this.methods = this.opts.methods || [
    'HEAD',
    'OPTIONS',
    'GET',
    'PUT',
    'PATCH',
    'POST',
    'DELETE'
  ];

  this.params = {};
  this.stack = [];
  this.MATCHS = {};
};

methods.forEach((method) => {
  Router.prototype[method] = function(name, path, middleware) {
    var middleware;

    if (typeof path === 'string' || path instanceof RegExp) {
      middleware = Array.prototype.slice.call(arguments, 2);
    } else {
      middleware = Array.prototype.slice.call(arguments, 1);
      path = name;
      name = null;
    }

    this.register(path, [method], middleware, {
      name: name
    });

    return this;
  };
});

// Alias for `router.delete()` because delete is a reserved word
Router.prototype.del = Router.prototype['delete'];

/**
 * Set the path prefix for a Router instance that was already initialized.
 *
 * @example
 *
 * ```javascript
 * router.prefix('/things/:thing_id')
 * ```
 *
 * @param {String} prefix
 * @returns {Router}
 */

Router.prototype.prefix = function(prefix) {
  prefix = prefix.replace(/\/$/, '');

  this.opts.prefix = prefix;

  this.stack.forEach(function(route) {
    route.setPrefix(prefix);
  });

  return this;
};

/**
 * Returns router middleware which dispatches a route matching the request.
 *
 * @returns {Function}
 */

Router.prototype.routes = Router.prototype.middleware = function() {
  var router = this;

  return async function dispatch(ctx, next) {
    debug('%s %s', ctx.method, ctx.path);

    var path = router.opts.routerPath || ctx.routerPath || ctx.path;
    var matched = router.match(path, ctx.method);

    // 如果匹配不到任何路由，则定位到错误页的控制器
    if (!matched.route && ctx.method == 'GET' && router.opts.errorPath) {
      path = router.opts.errorPath;
      matched = router.match(path, ctx.method);
    }

    // 如果匹配到则逐一执行控制器
    if (matched.pathAndMethod.length) {
      let i = matched.pathAndMethod.length;

      var mostSpecificPath = matched.pathAndMethod[i - 1].path
      ctx._matchedRoute = mostSpecificPath

      while (matched.route && i--) {
        let layer = matched.pathAndMethod[i];
        let ii = layer.stack.length;
        ctx.captures = layer.captures(path, ctx.captures);
        ctx.params = layer.params(path, ctx.captures, ctx.params);
        debug('dispatch %s %s', layer.path, layer.regexp);
        while (ii--) {
          if (layer.stack[ii].constructor.name === 'GeneratorFunction') {
            await co(layer.stack[ii].bind(ctx))
          } else {
            await layer.stack[ii].call(ctx);
          }
        }
      }
    }
  }
};

/**
 * Register route with all methods.
 *
 * @param {String} name Optional.
 * @param {String} path
 * @param {Function=} middleware You may also pass multiple middleware.
 * @param {Function} callback
 * @returns {Router}
 * @private
 */

Router.prototype.all = function(name, path, middleware) {
  var middleware;

  if (typeof path === 'string') {
    middleware = Array.prototype.slice.call(arguments, 2);
  } else {
    middleware = Array.prototype.slice.call(arguments, 1);
    path = name;
    name = null;
  }

  this.register(path, methods, middleware, {
    name: name
  });

  return this;
};

/**
 * Redirect `source` to `destination` URL with optional 30x status `code`.
 *
 * Both `source` and `destination` can be route names.
 *
 * ```javascript
 * router.redirect('/login', 'sign-in');
 * ```
 *
 * This is equivalent to:
 *
 * ```javascript
 * router.all('/login', function *() {
 *   this.redirect('/sign-in');
 *   this.status = 301;
 * });
 * ```
 *
 * @param {String} source URL or route name.
 * @param {String} destination URL or route name.
 * @param {Number} code HTTP status code (default: 301).
 * @returns {Router}
 */

Router.prototype.redirect = function(source, destination, code) {
  // lookup source route by name
  if (source[0] !== '/') {
    source = this.url(source);
  }

  // lookup destination route by name
  if (destination[0] !== '/') {
    destination = this.url(destination);
  }

  return this.all(source, function() {
    this.redirect(destination);
    this.status = code || 301;
  });
};

/**
 * Create and register a route.
 *
 * @param {String} path Path string.
 * @param {Array.<String>} methods Array of HTTP verbs.
 * @param {Function} middleware Multiple middleware also accepted.
 * @returns {Layer}
 * @private
 */

Router.prototype.register = function(path, methods, middleware, opts) {
  opts = opts || {};

  let stack = this.stack;

  // create route
  let route = new Layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || "",
  });

  if (this.opts.prefix) {
    route.setPrefix(this.opts.prefix);
  }

  // add parameter middleware
  Object.keys(this.params).forEach((param) => {
    route.param(param, this.params[param]);
  });

  // register route with router
  if (methods.length || !stack.length) {
    // if we don't have parameters, put before any with same route
    // nesting level but with parameters
    let added = false;

    if (!route.paramNames.length) {
      let routeNestingLevel = route.path.toString().split('/').length;

      added = stack.some((m, i) => {
        let mNestingLevel = m.path.toString().split('/').length;
        let isParamRoute = !!m.paramNames.length;
        if (routeNestingLevel === mNestingLevel && isParamRoute) {
          return stack.splice(i, 0, route);
        }
      });
    }

    if (!added) stack.push(route);
  } else {
    stack.some((m, i) => {
      if (!m.methods.length && i === stack.length - 1) {
        return stack.push(route);
      } else if (m.methods.length) {
        if (stack[i - 1]) {
          return stack.splice(i, 0, route);
        } else {
          return stack.unshift(route);
        }
      }
    });
  }

  return route;
};

/**
 * Lookup route with given `name`.
 *
 * @param {String} name
 * @returns {Layer|false}
 */

Router.prototype.route = function(name) {
  var routes = this.stack;

  for (var len = routes.length, i = 0; i < len; i++) {
    if (routes[i].name && routes[i].name === name) {
      return routes[i];
    }
  }

  return false;
};

/**
 * Generate URL for route. Takes a route name and map of named `params`.
 *
 * ```javascript
 * router.get('user', '/users/:id', function *(next) {
 *  // ...
 * });
 *
 * router.url('user', 3);
 * // => "/users/3"
 *
 * router.url('user', { id: 3 });
 * // => "/users/3"
 * ```
 *
 * @param {String} name route name
 * @param {Object} params url parameters
 * @returns {String|Error}
 */

Router.prototype.url = function(name, params) {
  var route = this.route(name);

  if (route) {
    var args = Array.prototype.slice.call(arguments, 1);
    return route.url.apply(route, args);
  }

  return new Error("No route found for name: " + name);
};

/**
 * Match given `path` and return corresponding routes.
 *
 * @param {String} path
 * @param {String} method
 * @returns {Object.<path, pathAndMethod>} returns layers that matched path and
 * path and method.
 * @private
 */

Router.prototype.match = function(path, method) {
  var layers = this.stack;
  var matched = {
    path: [],
    pathAndMethod: [],
    route: false
  };

  let flag = `${method}:${path}`;
  // 如果存在缓存的路径，则直接返回缓存的路由状态
  // TODO: 如果配置的规则路由特别多，内存溢出的风险
  if (this.MATCHS[flag]) return this.MATCHS[flag];

  for (var len = layers.length, i = 0; i < len; i++) {
    let layer = layers[i];

    debug('test %s %s', layer.path, layer.regexp);

    if (layer.match(path)) {
      matched.path.push(layer);

      if (layer.methods.length === 0 || ~layer.methods.indexOf(method)) {
        matched.pathAndMethod.push(layer);
        matched.route = true;
      }
    }
  }

  this.MATCHS[flag] = matched;
  return matched;
};

/**
 * Run middleware for named route parameters. Useful for auto-loading or
 * validation.
 *
 * @example
 *
 * ```javascript
 * router
 *   .param('user', function *(id, next) {
 *     this.user = users[id];
 *     if (!this.user) return this.status = 404;
 *     yield next;
 *   })
 *   .get('/users/:user', function *(next) {
 *     this.body = this.user;
 *   })
 *   .get('/users/:user/friends', function *(next) {
 *     this.body = yield this.user.getFriends();
 *   })
 *   // /users/3 => {"id": 3, "name": "Alex"}
 *   // /users/3/friends => [{"id": 4, "name": "TJ"}]
 * ```
 *
 * @param {String} param
 * @param {Function} middleware
 * @returns {Router}
 */

Router.prototype.param = function(param, middleware) {
  this.params[param] = middleware;
  this.stack.forEach((route) => {
    route.param(param, middleware);
  });
  return this;
};

/**
 * Generate URL from url pattern and given `params`.
 *
 * @example
 *
 * ```javascript
 * var url = Router.url('/users/:id', {id: 1});
 * // => "/users/1"
 * ```
 *
 * @param {String} path url pattern
 * @param {Object} params url parameters
 * @returns {String}
 */
Router.url = function(path, params) {
  return Layer.prototype.url.call({ path: path }, params);
};
