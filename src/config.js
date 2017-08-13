'use strict';

const path = require('path');
const extend = require('extend');

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
  const cfg = require('../config/main');
  // 获取当前的环境
  const env = args.env || 'development';

  // 获取环境配置
  const envPath = path.resolve(`./config/main.${env}.js`);
  try {
    extend(cfg, require(envPath));
  } catch (err) {
    throw `Load ${env} Config Error：${envPath}`;
  }

  // 如果允许增量配置，则继承增量配置
  if (cfg.extend) {
    const extPath = path.resolve(cfg.extend);
    try {
      // 深复制
      extend(true, cfg, require(extPath));
    } catch (err) {
      throw `Load Extend Config Error：${extPath}`;
    }
  }

  return cfg;
};
