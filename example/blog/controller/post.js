module.exports = function* () {
  yield this.bindDefault();

  yield this.render('index', {
    title: 'Hello Koa-hornbill!'
  });

  this.body = this.params;
}
// 配置index路由为get请求
module.exports.__method__ = 'get';

// 配置index路由的regular
module.exports.__regular__ = '/:id/:test';