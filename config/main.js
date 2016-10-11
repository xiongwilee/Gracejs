/**
 * 默认公共配置文件
 */

"use strict";

let env = process.env.NODE_ENV || 'development';

module.exports = {
  // 扩展配置文件路径 配置文件名分别为：
  //  * main.development.js 开发环境
  //  * main.testing.js 测试环境
  //  * main.production.js 生产环境
  extend: './config/'
}
