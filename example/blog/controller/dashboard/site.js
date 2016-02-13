'use strict';
function checkAuth (ctx, userInfo){
  if(!userInfo || !userInfo.isAuthor){
    ctx.redirect('/error/403')
  }
}

module.exports.aj_link_delete = function* (){
  yield this.bindDefault();
  checkAuth(this, this.userInfo);

  let id = this.request.body.id;
  let result = {code:0,message:''};

  let LinkModel = this.mongo('Link');

  let link = yield LinkModel.deleteLink(id);

  if(!link){
    result.code = 1;
    result.message = '链接不存在！'; 
  }

  this.body = result;
  return;
};
module.exports.aj_link_delete.__method__ = 'post';

module.exports.aj_link_edit = function* (){
  yield this.bindDefault();
  checkAuth(this, this.userInfo);
  
  let data = this.request.body;
  let is_new = data.is_new;
  let result = {code:0,message:''};

  let LinkModel = this.mongo('Link',{
    id: data.id,
    name: data.name,
    href: data.href
  });

  let link = yield LinkModel.getLinkById(data.id);

  if(is_new == 1 && link){
    result.code = '1';
    result.message = '链接已经存在，请勿重复添加！';

    this.body = result;
    return;
  }else if(is_new == 0 && !link){
    result.code = '2';
    result.message = '该链接不存在，无法编辑！';

    this.body = result;
    return;
  }

  let res = yield LinkModel.edit( is_new );

  this.body = result;
}
module.exports.aj_link_edit.__method__ = 'post';

module.exports.link = function* () {
  yield this.bindDefault();
  checkAuth(this, this.userInfo);

  yield this.render('dashboard/site_link',{
    breads : ['站点管理','链接管理'],
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}