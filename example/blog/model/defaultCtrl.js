'use strict';

const crypto = require('crypto');
const key = "http://mlsfe.biz/private_key"; //加密的秘钥

function _deciph(user_id) {
  let decipher = crypto.createDecipher('aes-256-cbc', key);
  let dec = decipher.update(user_id, 'hex', 'utf8');
  dec += decipher.final('utf8'); //解密之后的值

  return JSON.parse(dec);
}

function _getItem(arr){
  var result = {};
  arr.forEach(function(item){
    result[item.id] = item;
  });
  return result;
}

module.exports = function*() {
  this.siteInfo = {
    path : this.path,
    title : '美丽说商业前端团队博客-http://mlsfe.biz',
    year : new Date().getFullYear()
  }

  this.siteInfo.users = yield this.mongo('User').getAuthor();
  this.siteInfo.users_item = _getItem(this.siteInfo.users);

  this.siteInfo.cates = yield this.mongo('Category').list();
  this.siteInfo.cates_item = _getItem(this.siteInfo.cates);
  
  this.siteInfo.links = yield this.mongo('Link').list();



  let user_id = this.cookies.get('USER_ID');
  let user_info = {};

  if (!user_id) {
    return;
  }

  try {
    user_info = _deciph(user_id);
  } catch (err) {
    console.log(err)
  }

  if (!user_info.user_id || user_info.ip !== this.request.ip || user_info.time < Date.now()) {
    return;
  }

  this.userInfo = yield this.mongo('User', {}).getUserById(user_info.user_id);
}