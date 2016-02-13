'use strict';
module.exports.index = function* () {
  yield this.bindDefault();

  let pageNum = this.query.page;
  let PostModel = this.mongo('Post');

  let mongoResult = yield [{
      model: PostModel,
      fun: 'page',
      arg: [pageNum]
    },{
      model:PostModel,
      fun:'count',
      arg: [pageNum]
    }].map(this.mongoMap);

  let posts = mongoResult[0];
  let page = mongoResult[1];

  yield this.render('home',{
    page: page,
  	posts: posts,
  	userInfo: this.userInfo,
  	siteInfo: this.siteInfo
  })
}

module.exports.about = function* () {
  yield this.bindDefault();

  yield this.render('home_about',{
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}

module.exports.join = function* () {
  yield this.bindDefault();

  yield this.render('home_join',{
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}