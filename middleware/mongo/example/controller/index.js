'use strict';

exports.index = function*() {
  let postModel = this.mongo('Post', {});

  var list = yield postModel.listPost();

  this.body = list;
}

exports.mult = function*() {
  let postModel = this.mongo('Post');

  let postAddModel = this.mongo('Post', { title: 'test2', author: 'wilee2', content: 'test2', tips: 't2' });

  var list = yield this.mongoMap([{
    model: postModel,
    fun: postModel.listPost,
    arg: []
  }, {
    model: postModel,
    fun: postModel.listPost,
    arg: []
  }, {
    model: postAddModel,
    fun: postAddModel.addPost,
    arg: []
  }]);

  this.body = list;
}

exports.add = function*() {
  let postModel = this.mongo('Post', { title: 'test2', author: 'wilee2', content: 'test2', tips: 't2' });

  let err = yield postModel.addPost();

  this.body = err || 'add success!';
}

exports.index.method = 'get';
