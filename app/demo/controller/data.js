'use strict';

exports.info = {
  repo: function*() {
    yield this.proxy('github_api:repos/xiongwilee/koa-grace')
  }
}

exports.session = function*() {
  this.session.test = this.session.test || 0;
  this.session.test++;

  this.body = this.session.test
}
