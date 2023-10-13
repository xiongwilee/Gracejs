'use strict';

const path = require('path');
const extend = require('./utils').extendTwoObj;

/**
 * 获取配置文件
 * @param  {object} args 执行node bin/server.js 时的命令行参数
 * @return {object}      配置详情
 */
module.exports = function config(args) {
  // 获取默认配置
  const cfg = require('../config/main');
  // 获取当前的环境
  const env = process.env.ENV || args.env || 'development';

  // 获取环境配置
  const envPath = path.resolve(`./config/main.${env}.js`);
  extend(cfg, require(envPath));

  // 如果允许增量配置，则继承增量配置
  if (cfg.server_extend) {
    const serverConfigPath = path.resolve(cfg.server_extend);
    // 深复制
    extend(cfg, require(serverConfigPath));
  }

  // 如果允许增量环境变量配置，则继承增量配置
  if (cfg.env_extend) {
    const envConfigPath = path.resolve(cfg.env_extend);
    const envKeys = require(envConfigPath);
    // 获取环境变量后深度赋值
    extend(cfg, envKeys, (envName) => process.env[envName]);
  }

  return cfg;
};
