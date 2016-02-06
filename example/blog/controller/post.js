module.exports = function* () {
  yield this.bindDefault();

  yield this.render('index', {
    title: 'Hello Koa-hornbill!'
  });
}
// 配置index路由为get请求
module.exports.__method__ = 'get';