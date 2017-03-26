'use strict';

let userAuthor = require('./userAuthor');

exports.home = async function () {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};

  await this.render('dashboard/site_home',{
    breads : ['站点管理','通用'],
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}

exports.aj_link_delete = async function (){
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};

  let id = this.request.body.id;
  let result = {code:0,message:''};

  let LinkModel = this.mongo('Link');

  let link = await LinkModel.deleteLink(id);

  if(!link){
    result.code = 1;
    result.message = '链接不存在！'; 
  }

  this.body = result;
  return;
};
exports.aj_link_delete.__method__ = 'post';

exports.aj_link_edit = async function (){
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};
  
  let data = this.request.body;
  let is_new = data.is_new;
  let result = {code:0,message:''};

  let LinkModel = this.mongo('Link',{
    id: data.id,
    name: data.name,
    href: data.href
  });

  let link = await LinkModel.getLinkById(data.id);

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

  let res = await LinkModel.edit( is_new );

  this.body = result;
}
exports.aj_link_edit.__method__ = 'post';

exports.link = async function () {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};

  await this.render('dashboard/site_link',{
    breads : ['站点管理','链接管理'],
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}