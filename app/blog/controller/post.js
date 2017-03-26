'use strict';

exports.content = async function () {
  await this.bindDefault();
  let PostModel = this.mongo('Post');


  let id = this.params.id;
  let post = await PostModel.getPostById(id);

  if( !post ){
    this.body = '没有该文章！';
    return;
  }

  let content = post.content.split('\n');
  let sliderContent = [],
    sliderConfig = {},
    flag = true;

  content.forEach(function (item) {
    let matched = flag && item.match(/^\>\ ([0-9a-zA-Z_-]+)\ ?[\:：]\ ?([0-9a-zA-Z_-]+)/);
    if (matched) {
      sliderConfig[matched[1]] = matched[2];
    } else {
      flag = false;
      sliderContent.push(item);
    }
  });

  if (sliderConfig.type == 'slider') {
    await this.render('post_slider', {
      sliderConfig: sliderConfig,
      sliderContent: sliderContent.join('\n'),
      post: post,
      userInfo: this.userInfo,
      siteInfo: this.siteInfo
    });
  }else{
    await this.render('post_content', {
      post: post,
      userInfo: this.userInfo,
      siteInfo: this.siteInfo
    });
  }
}
// 配置index路由的regular
exports.content.__regular__ = '/:id';

exports.cate = async function () {
  await this.bindDefault();
  let PostModel = this.mongo('Post');


  let id = this.params.id;
  let pageNum = this.query.page;
  let posts = await PostModel.page(pageNum,undefined,{category:id});
  let page = await PostModel.count(pageNum,undefined,{category:id});
  let cate = this.siteInfo.cates_item[id];

  if( !cate ){
    this.body = '分类不存在！';
    return;
  }

  await this.render('post_cate', {
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