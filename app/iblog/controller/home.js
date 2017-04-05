'use strict';

const base = require('./base.js');

exports.index = async function() {
  await this.bindDefault();

  let page = parseInt(this.query.page) || 1;

  let res = await this.proxy({
    issues: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues?state=open&filter=created&page=${page}`
    // issues: `github_api:/repos/koajs/koa/issues?state=all&page=3`
  }, {
    headers: { 'Authorization': `token ${base.config.token}` }
  })
  
  let postInfo = base.getPostList(res.issues);

  Object.assign(postInfo.page, {
    curr: page,
    total: postInfo.page.last || 1
  })

  await this.render('home', {
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: postInfo
  })
}
