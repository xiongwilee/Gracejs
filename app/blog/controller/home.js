'use strict';
exports.index = function* () {
  yield this.bindDefault();

  let pageNum = this.query.page;
  let PostModel = this.mongo('Post');

  let mongoResult = yield this.mongoMap([{
      model: PostModel,
      fun: PostModel.page,
      arg: [pageNum]
    },{
      model: PostModel,
      fun:PostModel.count,
      arg: [pageNum]
    }]);

  let posts = mongoResult[0];
  let page = mongoResult[1];

  yield this.render('home',{
    page: page,
  	posts: posts,
  	userInfo: this.userInfo,
  	siteInfo: this.siteInfo
  })
}

exports.about = function* () {
  yield this.bindDefault();

  yield this.render('home_about',{
    breads : ['关于'],
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}

exports.join = function* () {
  yield this.bindDefault();

  yield this.render('home_join',{
    breads : ['加入'],
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}