'use strict';
module.exports['403'] = function* () {
  let message = this.params.message || '您没有权限！';
  this.body = message;
}
module.exports['403'].__regular__ = '/:message'