'use strict';
module.exports = function* () {
  yield this.bindDefault();

  yield this.render('home_about',{
    breads : ['关于'],
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}
// 配置index路由为get请求
module.exports.__method__ = 'get';