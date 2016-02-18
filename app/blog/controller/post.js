'use strict';

exports.content = function* () {
  yield this.bindDefault();
  let PostModel = this.mongo('Post');


  let id = this.params.id;
  let post = yield PostModel.getPostById(id);

  if( !post ){
    this.body = '没有该文章！';
    return;
  }

  yield this.render('post_content', {
    post: post,
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  });
}
// 配置index路由的regular
exports.content.__regular__ = '/:id';

exports.cate = function* () {
  yield this.bindDefault();
  let PostModel = this.mongo('Post');


  let id = this.params.id;
  let pageNum = this.query.page;
  let posts = yield PostModel.page(pageNum,undefined,{category:id});
  let page = yield PostModel.count(pageNum,undefined,{category:id});
  let cate = this.siteInfo.cates_item[id];

  if( !cate ){
    this.body = '分类不存在！';
    return;
  }

  yield this.render('post_cate', {
    breads : ['分类',cate.name],
    cate: this.siteInfo.cates_item[id],
    page: page,
  	posts: posts,
  	userInfo: this.userInfo,
  	siteInfo: this.siteInfo
  });
}
// 配置index路由的regular
exports.cate.__regular__ = '/:id';