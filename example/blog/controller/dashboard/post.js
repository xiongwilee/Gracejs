'use strict';
function checkAuth (ctx, userInfo){
  if(!userInfo || !userInfo.isAuthor){
    ctx.redirect('/error/403')
  }
}

module.exports.list = function* () {
  yield this.bindDefault();
  checkAuth(this, this.userInfo);

  yield this.render('dashboard/post_new')
}


module.exports.aj_edit = function* (){
  let data = this.request.body;
  let is_new = data.is_new;
  let result = {code:0,message:''};

  let PostModel = this.mongo('Post',{
    id: data.id,
    title: data.title,
    image: data.image,
    time: data.time,
    author: data.author,
    content: data.content,
    htmlContent: data.htmlContent,
    category: data.category
  });

  let doc = yield PostModel.getPostById(data.id);

  if(is_new == 1 && doc){
    result.code = '1';
    result.message = '文章已经存在，请勿重复添加！';

    this.body = result;
    return;
  }else if(is_new == 0 && !doc){
    result.code = '2';
    result.message = '文章不存在，无法编辑！';

    this.body = result;
    return;
  }

  let res = yield PostModel.edit( is_new );

  this.body = result;
}
module.exports.aj_edit.__method__ = 'post';


module.exports.edit = function* () {
  yield this.bindDefault();
  checkAuth(this, this.userInfo);

  let post;
  let post_id = this.query.id;

  if(post_id){
    post = yield this.mongo('Post').getPostById(post_id);
  }

  yield this.render('dashboard/post_edit',{
    isNew: !post_id,
    breads : ['文章管理','新文章'],
    post:post,
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}