'use strict';

exports.info = {
  repo: function*(){
    yield this.proxy('github:repos/xiongwilee/koa-grace')
  }
}