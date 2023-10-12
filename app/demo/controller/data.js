'use strict';

exports.info = {
  repo: function*(){
    yield this.proxy('github_api:repos/xiongwilee/gracejs')
  }
}
