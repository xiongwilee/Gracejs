/**
 * 默认公共配置文件
 */

"use strict";

let env = process.env.NODE_ENV || 'development';

module.exports = {
  // 用以配置不在代码仓储中的配置文件 
  extend: './config/server.json'
}
