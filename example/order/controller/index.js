exports.index = function* () {
  yield this.render('index', {
    title: 'Hello Koa!'
  });
}
exports.index.method = 'get';