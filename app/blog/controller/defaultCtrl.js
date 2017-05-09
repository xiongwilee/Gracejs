'use strict';

const crypto = require('crypto');
const key = "http://mlsfe.biz/private_key"; //加密的秘钥

function _deciph(user_id) {
  let decipher = crypto.createDecipher('aes-256-cbc', key);
  let dec = decipher.update(user_id, 'hex', 'utf8');
  dec += decipher.final('utf8'); //解密之后的值

  return JSON.parse(dec);
}

function _getItem(arr) {
  var result = {};
  arr.forEach(function(item) {
    result[item.id] = item;
  });
  return result;
}

module.exports = async function() {
  let UserModel = this.mongo('User');
  let CateModel = this.mongo('Category');
  let LinkModel = this.mongo('Link');

  this.siteInfo = {
    path: this.path,
    title: '前端俱乐部-https://feclub.cn',
    year: new Date().getFullYear()
  }


  let mongoResult = await this.mongoMap([{
    model: UserModel,
    fun: UserModel.list
  }, {
    model: CateModel,
    fun: CateModel.list
  }, {
    model: LinkModel,
    fun: LinkModel.list
  }]);

  this.siteInfo.users = mongoResult[0];
  this.siteInfo.users_item = _getItem(this.siteInfo.users);

  this.siteInfo.cates = mongoResult[1];
  this.siteInfo.cates_item = _getItem(this.siteInfo.cates);

  this.siteInfo.links = mongoResult[2];



  let user_id = this.cookies.get('USER_ID');
  let user_info = {};
  let isApi = (this.path.indexOf('/api/') == 0);

  // 如果是api开头path的话， 就认为是第三方请求， user_id密钥从请求信息中获取
  if (isApi) {
    user_id = user_id || this.query.secret_id || this.request.body.secret_id;
  }

  if (!user_id) {
    return;
  }

  try {
    user_info = _deciph(user_id);
  } catch (err) {
    console.log(err)
  }

  if (!isApi) {
    if (!user_info.user_id 
        || user_info.ip !== this.request.ip 
        || user_info.time < Date.now()
        ) {
      return;
    }
  }

  this.userInfo = await this.mongo('User', {}).getUserById(user_info.user_id);
}

// 设置为非路由
exports.__controller__ = false;