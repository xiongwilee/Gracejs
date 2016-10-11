'use strict';

/* 默认配置下测试： 127.0.0.1:3000/test/ */
exports.index = function*() {
  this.session.test = this.session.test || 0;
  this.session.test++;

  console.log(this.session);
  this.body = this.session;
}
