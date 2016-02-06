exports.index = function* () {
  yield this.bindDefault();

  yield this.render('index', {
    title: 'Hello Koa-hornbill!'
  });
}
// 配置index路由为get请求
exports.index.__method__ = 'get';