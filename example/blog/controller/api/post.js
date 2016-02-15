'use strict';

let userAuthor = require('../dashboard/userAuthor');

module.exports.aj_cate_list = function* (){
  yield this.bindDefault();
  if( !userAuthor.checkAuth(this, this.userInfo, false, true) ){return};

  this.body = this.siteInfo.cates;
};
module.exports.aj_cate_list.__method__ = 'all';


module.exports.aj_post_delete = function* (){
  yield this.bindDefault();
  if( !userAuthor.checkAuth(this, this.userInfo, false, true) ){return};

  let id = this.request.body.id;
  let result = {code:0,message:''};

  let PostModel = this.mongo('Post');
  let CateModel = this.mongo('Category');

  let post = yield PostModel.deletePost(id);

  if(!post){
    result.code = 1;
    result.message = '文章不存在！';
    
    this.body = result;
    return;
  }

  if(post.category){
    let cate = yield CateModel.numbMinus(post.category);

    this.body = result;
    return;
  }else{
    this.body = result;
    return;
  }
};
module.exports.aj_post_delete.__method__ = 'all';

module.exports.aj_edit = function* (){
  yield this.bindDefault();
  if( !userAuthor.checkAuth(this, this.userInfo, false, true) ){return};

  let data = this.request.body;
  let is_new = data.is_new;
  let author = data.author || this.userInfo.id;
  let category = this.category;
  let result = {code:0,message:''};
console.log(data);
  if(!this.siteInfo.cates_item || !this.siteInfo.cates_item[category]){
    result.code = 3;
    result.message = '没有找到对应的文章分类';

    this.body = result;
    return;
  }

  let PostModel = this.mongo('Post',{
    id: data.id,
    title: data.title,
    image: data.image,
    from: data.from,
    author: author,
    content: data.content,
    htmlContent: data.htmlContent,
    introContent: data.introContent,
    category: category
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

  if(is_new == 1){
    yield this.mongo('Category').numbAdd( data.category );    
  }

  this.body = result;
}
module.exports.aj_edit.__method__ = 'all';