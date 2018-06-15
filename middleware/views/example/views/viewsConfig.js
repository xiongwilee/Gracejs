'use strict';

const path = require('path');
const fs = require('fs');

/**
 * 各类模板引擎独立的配置
 * 其他引擎的配置可以在这里添加
 */

/**
 * [nunjucks 个性化定制]
 * 参考：https://github.com/tj/consolidate.js#template-engine-instances
 * 
 * @param  {Object} consolidate consolidate对象
 * @param  {Object} config      配置项
 *
 * @todo 这里有两个坑：
 *       1. cache配置似乎没作用
 *       2. 如果这个文件在业务模块 views/viewsConfig.js 中的化，`require('nunjucks')`可能会报错
 * 
 * @return 
 */
module.exports = function(consolidate, config) {
  const nunjucks = require('nunjucks');
  consolidate.requires.nunjucks = nunjucks.configure(config.root, {
    noCache: !config.cache
  });

  // 注入全局变量
  consolidate.requires.nunjucks.addGlobal('G', global);

  // 添加raw filter示例
  const RAW_BUFFER = {};
  consolidate.requires.nunjucks.addFilter('raw', function(val) {
    const filePath = path.resolve(config.root, val);

    // 首先获取缓存
    if (RAW_BUFFER[filePath]) {
      return RAW_BUFFER[filePath];
    }

    try {
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });

      return RAW_BUFFER[filePath] = nunjucks.runtime.markSafe(fileContent);
    } catch (err) {
      console.error(err);
    }
  });
}
