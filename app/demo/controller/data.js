'use strict';

exports.info = {
  repo: function*() {
    yield this.proxy('github_api:repos/xiongwilee/koa-grace')
  }
}

// proxy待参数案例
exports.test = function*() {
  this.request.body = {
    test: 'testtest'
  }

  yield this.proxy('local:post:data/test_data')
}

exports.test_data = function*() {
  this.body = this.request.body
}


// mock数据案例
// 这里的数据依旧会向local接口发请求
// 但是如果local如果配置为：http://127.0.0.1:3000/__MOCK__/demo/的话
// 相当于请求到了 http://127.0.0.1:3000/__MOCK__/demo/
// 这里的实际上做的事情是在demo模块中的mock目录中取伪JSON文件,然后返回
// 这样的话：
//  在自己的项目目录中，与后端订好了接口字段，在mock文件夹中写json，然后改一下本地的API配置
//  就可以在本地模拟后端数据接口了
exports.mock_1 = function*() {
  yield this.proxy({
    test: 'local:post:data/test_data'
  })
  this.body = this.backData.test;
}
exports.mock_2 = function*() {
  yield this.proxy({
    test: 'local:test'
  })

  this.body = this.backData.test;
}

exports.session = function*() {
  this.session.test = this.session.test || 0;
  this.session.test++;

  this.body = this.session.test
}
