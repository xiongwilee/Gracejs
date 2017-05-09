'use strict';

/**
 * 各类模板引擎独立的配置
 * 其他引擎的配置可以在这里添加
 */

exports.nunjucks = function(tpl, config, data) {
  data.settings = {
    views: config.root,
    options: {
      noCache: config.cache,
      watch: true
    }
  };
  
  // nunjucks引擎下，需使用G调用全局函数
  data.G = global;

  return data;
}

exports.ect = function(tpl, config, data) {
  data.root = config.root;

  return data;
}
