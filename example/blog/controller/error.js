'use strict';
module.exports['403'] = function* () {
  this.body = '您没有权限！';
}
// 配置index路由为get请求
module.exports.__method__ = 'get';