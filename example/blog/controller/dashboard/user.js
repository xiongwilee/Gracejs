'use strict';
function checkAuth (ctx, userInfo){
  if(!userInfo || !userInfo.isAuthor){
    ctx.redirect('/error/403')
  }
}

module.exports.list = function* () {
  yield this.bindDefault();
  checkAuth(this, this.userInfo);

  let users = yield this.mongo('User').list();

  yield this.render('dashboard/user_list',{
    breads : ['用户管理','用户列表'],
    users : users,
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}