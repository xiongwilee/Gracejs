/**
 * separate from co-views / 2016-09-29
 * co-views: "version": "2.1.0"

 * 2.1.0 / 2015-08-28
 * enable partials in render
 * replace utils-merge with object-assign

 * 2.0.0 / 2015-08-18
 * co-render@1
 * switch to Promise

 * 1.0.0 / 2015-06-02
 * proxy partials

 * 0.3.0 / 2015-02-11
 * merge locals from opts
 * add basic tests
 * fix examples and readme
 * bump deps, devDeps

 * 0.2.0 / 2014-01-25
 * rename .ext to .default. Closes #1

 * 0.1.0 / 2013-09-06
 * add .cache option support
 */

/**
 * Module dependencies.
 */

var debug = require('debug')('co-views');
var render = require('./render.js');
var path = require('path');
var extname = path.extname;
var join = path.join;

/**
 * Environment.
 */

var env = process.env.NODE_ENV || 'development';

/**
 * Pass views `dir` and `opts` to return
 * a render function.
 *
 *  - `map` an object mapping extnames to engine names [{}]
 *  - `default` default extname to use when missing [html]
 *  - `cache` cached compiled functions [NODE_ENV != 'development']
 *
 * @param {String} [dir]
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */

module.exports = function(dir, opts){
  opts = opts || {};

  debug('views %s %j', dir, opts);

  // view directory
  dir = dir || 'views';

  // default extname
  var ext = opts.ext || opts.default || 'html';

  // engine map
  var map = opts.map || {};

  // proxy partials
  var partials = opts.partials || {};

  // cache compiled templates
  var cache = opts.cache;
  if (null == cache) cache = 'development' != env;

  return function(view, locals){
    locals = locals || {};

    // merge opts.locals
    if (opts.locals) {
      locals = Object.assign(locals, opts.locals);
    }

    // default extname
    var e = extname(view);

    if (!e) {
      e = '.' + ext;
      view += e;
    }

    // remove leading '.'
    e = e.slice(1);

    // map engine
    locals.engine = map[e] || e;

    // resolve
    view = join(dir, view);

    // cache
    locals.cache = cache;

    locals.partials = Object.assign(locals.partials || {}, partials);

    debug('render %s %j', view, locals);
    return render(view, locals);
  };
};
