'use strict';

let userAuthor = require('./userAuthor');

exports.mine = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};

  await this.render('dashboard/user_mine', {
    breads: ['用户管理', '我的信息'],
    secretId: this.cookies.get('USER_ID'),
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}

exports.list = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};

  let users = await this.mongo('User').list();

  await this.render('dashboard/user_list', {
    breads: ['用户管理', '用户列表'],
    users: users,
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}

exports.aj_user_delete = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};

  let id = this.request.body.id;
  let result = {
    code: 0,
    message: ''
  };

  if (id == this.userInfo.id) {
    result.code = 2;
    result.message = '您不能删除自己';

    this.body = result;
    return;
  }

  let UserModel = this.mongo('User');
  let User = await UserModel.deleteUser(id);

  if (!User) {
    result.code = 1;
    result.message = '用户不存在！';
  }

  this.body = result;
  return;
};
exports.aj_user_delete.__method__ = 'post';

exports.aj_user_author_add = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo, true, true)) {
    return;
  };

  let id = this.request.body.id;
  let result = {
    code: 0,
    message: ''
  };

  let UserModel = this.mongo('User', {
    id: id,
    isAuthor: true
  });

  let User = await UserModel.edit();

  if (!User) {
    result.code = 1;
    result.message = '用户不存在！';
  }

  this.body = result;
  return;
};
exports.aj_user_author_add.__method__ = 'post';

exports.aj_user_author_delete = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo, true, true)) {
    return;
  };

  let id = this.request.body.id;
  let result = {
    code: 0,
    message: ''
  };

  if (id == this.userInfo.id) {
    result.code = 2;
    result.message = '您不能删除自己的作者权限';
    this.body = result;
    return;
  }

  let UserModel = this.mongo('User', {
    id: id,
    isAuthor: false
  });

  let User = await UserModel.edit();

  if (!User) {
    result.code = 1;
    result.message = '用户不存在！';
  }

  this.body = result;
  return;
};
exports.aj_user_author_delete.__method__ = 'post';