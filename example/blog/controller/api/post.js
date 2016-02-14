'use strict';
function checkAuth (ctx, userInfo){
  if(!userInfo || !userInfo.isAuthor){
    ctx.redirect('/error/403')
  }
}

module.exports.aj_post_delete = function* (){
  yield this.bindDefault();
  checkAuth(this, this.userInfo);

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
module.exports.aj_post_delete.__method__ = 'post';

module.exports.aj_edit = function* (){
  yield this.bindDefault();
  checkAuth(this, this.userInfo);

  let data = this.request.body;
  let is_new = data.is_new;
  let result = {code:0,message:''};

  let PostModel = this.mongo('Post',{
    id: data.id,
    title: data.title,
    image: data.image,
    from: data.from,
    author: data.author,
    content: data.content,
    htmlContent: data.htmlContent,
    introContent: data.introContent,
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

  if(is_new == 1){
    yield this.mongo('Category').numbAdd( data.category );    
  }

  this.body = result;
}
module.exports.aj_edit.__method__ = 'post';

module.exports.aj_cate_delete = function* (){
  yield this.bindDefault();
  checkAuth(this, this.userInfo);

  let id = this.request.body.id;
  let result = {code:0,message:''};

  let CateModel = this.mongo('Category');

  let cate = yield CateModel.deleteCate(id);

  if(!cate){
    result.code = 1;
    result.message = '分类不存在！'; 
  }else if(cate.numb > 0){
    result.code = 2;
    result.message = '该分类下还有文章，请删除后再试'; 
  }

  this.body = result;
  return;
};
module.exports.aj_cate_delete.__method__ = 'post';


module.exports.aj_cate_edit = function* (){
  yield this.bindDefault();
  checkAuth(this, this.userInfo);
  
  let data = this.request.body;
  let is_new = data.is_new;
  let result = {code:0,message:''};

  let CateModel = this.mongo('Category',{
    id: data.id,
    name: data.name,
    numb: data.numb
  });

  let doc = yield CateModel.getCategoryById(data.id);

  if(is_new == 1 && doc){
    result.code = '1';
    result.message = '分类已经存在，请勿重复添加！';

    this.body = result;
    return;
  }else if(is_new == 0 && !doc){
    result.code = '2';
    result.message = '该分类不存在，无法编辑！';

    this.body = result;
    return;
  }

  let res = yield CateModel.edit( is_new );

  this.body = result;
}
module.exports.aj_cate_edit.__method__ = 'post';