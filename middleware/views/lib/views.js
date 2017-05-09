'use strict';

const path = require('path');

const debug = require('debug')('koa-grace:views');
const error = require('debug')('koa-grace-error:views');
const consolidate = require('grace-consolidate');

const engines = require('./engines.js')

module.exports = function views(config) {
  let render = consolidate[config.engine];
  let engine = engines[config.engine];
  
  return function(tpl, data) {
    // TODO: 这里有个风险,如果模板数据中也存在cache之类的参数，cache配置则会被覆盖
    let locals = Object.assign({
      cache: config.cache
    }, config.locals, data);

    if (engine) {
      locals = engine(tpl, config, locals);
    }

    return render(tpl, locals);
  }
}
