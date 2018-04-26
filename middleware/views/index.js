/*!
 * koa-nunjucks-2
 * Copyright (c) 2017 strawbrary
 * MIT Licensed
 */
const bluebird = require('bluebird');
const difference = require('lodash.difference');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

/**
 * @param {Object} [cfg] 配置文件
 */
module.exports = (app, cfg = {}) => {
  const config = Object.assign({
    ext: 'html', // Extension that will be automatically appended to the file name in this.render calls. Set to a falsy value to disable.
    path: '', // Path to the templates.
    nunjucksConfig: {}, // Object of Nunjucks config options.
  }, cfg);

  config.path = path.resolve(process.cwd(), config.path);

  var extReg;
  if (config.ext) {
    config.ext = `.${config.ext.replace(/^\./, '')}`;
    extReg = new RegExp(`\\${config.ext}$`); // /\.html$/.test()
  } else {
    config.ext = '';
  }

  const env = nunjucks.configure(config.path, config.nunjucksConfig);
  const envConfigFile = path.resolve(config.path, 'envConfig.js');
  if (fs.existsSync(envConfigFile)) {
    try {
      const envConfig = require(envConfigFile);
      envConfig.call(app, env, config);
    } catch (err) {
      error(err);
    }
  }

  return async(ctx, next) => {

    /**
     * @param {string} view
     * @param {!Object=} context
     * @returns {string}
     */
    ctx.render = async(view, context) => {
      const mergedContext = Object.assign({}, ctx.state, context);

      // 兼容模板名称带后缀的情况
      if (!extReg || !extReg.test(view)) {
        view += config.ext;
      }

      ctx.type = 'html';
      ctx.body = env.render(view, mergedContext);

      return ctx;
    };

    await next();
  };
};