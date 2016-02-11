'use strict';
module.exports = function* () {
  yield this.bindDefault();

  let post = this.mongo('Post',{});
  let posts = yield post.list();

  yield this.render('home', {
  	title: 'wilee',
    posts: posts
  });
}
// 配置index路由为get请求
module.exports.__method__ = 'get';