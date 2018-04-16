exports.generator = function*() {
  this.body = 'hello world!';
}

exports.await = async function() {
  this.body = 'hello world!';
}

exports.bindDefault = function*(argument) {
  let result = yield this.bindDefault();
  this.body = result.data;
}

exports.param = async function() {
  this.body = this.params;
}
exports.param.__regular__ = '/:id1/:id2'

exports.post = function() {
  this.body = 'hello world!';
}
exports.post.__method__ = 'post'
