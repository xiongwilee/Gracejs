'use strict';

const crypto = require('crypto');
const key = "http://mlsfe.biz/private_key";//加密的秘钥

let client_id = '02f5d364d2d4aff85a00';
let client_secret = '015e99f9215438a681e4529efb47b72c6b574552';

module.exports.login = function*() {
  yield this.bindDefault();

  // 如果已经登录就不用再登录，直接重定向到首页
  if (this.userInfo && this.userInfo.id) {
    this.redirect('/home');
    return;
  }

  var path = "https://github.com/login/oauth/authorize";
      path += '?client_id='+client_id;
      path += '&redirect_uri='+this.request.protocol + '://' + this.request.host + '/user/oauth?from=github';
      path += '&scope=user';
      path += '&state = ' + (new Date()).valueOf();

  this.redirect(path);
}

module.exports.logout = function*() {
  this.cookies.set('USER_ID', '', {
    expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  });
  this.redirect('/home');
}

module.exports.oauth = function*() {
  let code = this.query.code;

  this.headers.Accept = 'application/json';
  // 获取access_token
  yield this.fetch({
    oauthInfo: 'github:post:login/oauth/access_token?client_id='+client_id+'&client_secret='+client_secret+'&code=' + code
  })
  let access_token = this.backData.oauthInfo.access_token;
  // 如果没有获取到access_token则直接返回
  if (!access_token) {
    this.body = this.backData;
    return;
  }

  // 获取用户github信息
  yield this.fetch({
    userInfo: 'github_api:user?access_token=' + access_token
  });
  let _userInfo = this.backData.userInfo;
  // 如果没有登录信息，则返回
  if(!_userInfo.login){
    this.body = this.backData;
    return;
  }

  // 查看数据库中对应的用户，没有则添加到数据库
  let userModel = this.mongo('User', {
    id: _userInfo.login,
    name: _userInfo.login,
    nickname: _userInfo.login,
    avatar: _userInfo.avatar_url,
    github: _userInfo.html_url,
    email: _userInfo.email,
    blog: _userInfo.blog
  });
  // 查找数据库中用户信息
  this.userInfo = yield userModel.getUserById(_userInfo.login);
  // 如果不存在，则添加
  if (!this.userInfo) {
    this.userInfo = yield userModel.save();
  }

  // 将用户id加密之后存到cookie中
  let expiresTime = Date.now() + 1000 * 60 * 60 * 24 * 30;
  let USER_INFO = JSON.stringify({
    user_id : this.userInfo.id,
    ip : this.request.ip,
    time : expiresTime
  });
  let cipher = crypto.createCipher('aes-256-cbc',key)
  let cryptedInfo =cipher.update(USER_INFO,'utf8','hex');
  cryptedInfo += cipher.final('hex');
  // 设置COOKIE，时效为30天
  this.cookies.set('USER_ID', cryptedInfo, {
    expires: new Date(expiresTime)
  });

  this.redirect('/home');
}