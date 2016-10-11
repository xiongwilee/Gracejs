exports.index = function*() {
  this.body = 'hello world!';
}
exports.index.__controller__ = false;