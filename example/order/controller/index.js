exports.index = function* () {
  yield this.render('index', {
    title: 'Hello Koa-hornbill!'
  });
}
exports.index.method = 'get';