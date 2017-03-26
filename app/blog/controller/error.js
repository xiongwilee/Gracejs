'use strict';
exports['403'] = async function () {
  let message = this.params.message || '您没有权限！';
  this.body = message;
}
exports['403'].__regular__ = '/:message'