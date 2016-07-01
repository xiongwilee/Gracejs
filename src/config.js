'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');

/**
 * 获取配置文件
 * @param  {object} args 执行node bin/server.js 时的命令行参数
 * @return {object}      配置详情
 */
module.exports = function config(args) {
  // 将端口号写入环境变量
  if (args.port) {
  	process.env.PORT = args.port;
  }

  // 获取默认配置
  let config = require('../config/main');
  let extendConfig = {};
  let env = args.env || 'development';

  // 获取增量配置文件
  let fileName = 'main.' + env + '.js';
 
  // 如果允许增量配置，则继承增量配置
  if (config.extend) {

    let extPath = path.resolve(config.extend, fileName);

    extendConfig = fs.existsSync(extPath) ? require(extPath) : extendConfig;

  }

  return util._extend(config, extendConfig);
}
