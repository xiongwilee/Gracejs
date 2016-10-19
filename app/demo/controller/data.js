'use strict';

exports.info = {
  repo: function*() {
    yield this.proxy('github_api:repos/xiongwilee/koa-grace')
  }
}

exports.test = function*(){
	this.request.body = {
		test:'testtest'
	}

	yield this.proxy('local:post:data/test_data')
}

exports.test_data = function*(){
	this.body = this.request.body
}

exports.session = function*() {
  this.session.test = this.session.test || 0;
  this.session.test++;

  this.body = this.session.test
}
