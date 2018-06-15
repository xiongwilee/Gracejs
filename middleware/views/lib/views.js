'use strict';

const path = require('path');
const fs = require('fs');

const debug = require('debug')('koa-grace:views');
const error = require('debug')('koa-grace-error:views');
const consolidate = require('consolidate');

const engines = require('./engines.js');

module.exports = function views(app, config) {
  let engineExtend;
  // 获取自定义配置
  const viewsConfigPath = path.resolve(config.root, 'viewsConfig.js');
  if (fs.existsSync(viewsConfigPath)) {
    engineExtend = require(viewsConfigPath);
  } else {
    engineExtend = engines[config.engine];
  }

  if (engineExtend) {
    engineExtend.call(app, consolidate, config);
  }

  const render = consolidate[config.engine];

  return function(tpl, data) {
    const locals = Object.assign({}, config.locals, data);

    return render(tpl, locals);
  }
}