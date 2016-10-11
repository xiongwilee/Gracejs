'use strict';

let userAuthor = require('./userAuthor');

exports.mine = function*() {
  yield this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};

  yield this.render('dashboard/user_mine', {
    breads: ['用户管理', '我的信息'],
    secretId: this.cookies.get('USER_ID'),
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}

exports.list = function*() {
  yield this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {return};

  let users = yield this.mongo('User').list();

  yield this.render('dashboard/user_list', {
    breads: ['用户管理', '用户列表'],
    users: users,
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}

exports.aj_user_delete = function*() {
  yield this.bindDefault();
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
  let User = yield UserModel.deleteUser(id);

  if (!User) {
    result.code = 1;
    result.message = '用户不存在！';
  }

  this.body = result;
  return;
};
exports.aj_user_delete.__method__ = 'post';

exports.aj_user_author_add = function*() {
  yield this.bindDefault();
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

  let User = yield UserModel.edit();

  if (!User) {
    result.code = 1;
    result.message = '用户不存在！';
  }

  this.body = result;
  return;
};
exports.aj_user_author_add.__method__ = 'post';

exports.aj_user_author_delete = function*() {
  yield this.bindDefault();
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

  let User = yield UserModel.edit();

  if (!User) {
    result.code = 1;
    result.message = '用户不存在！';
  }

  this.body = result;
  return;
};
exports.aj_user_author_delete.__method__ = 'post';