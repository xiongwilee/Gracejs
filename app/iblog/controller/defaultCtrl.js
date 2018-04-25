'use strict';

const base = require('./base.js');

module.exports = async function() {
  this.assert(!!base.config.token, 401, 'Personal Access Token Undefined!');
  
  // 获取用户github信息
  const res = await this.proxy({
    ownerInfo: `github_api:user?access_token=${base.config.token}`,
    repoInfo: `github_api:/repos/${base.config.owner}/${base.config.repo}`,
    labelInfo: `github_api:/repos/${base.config.owner}/${base.config.repo}/labels`
  }, {
    headers: { Authorization: `token ${base.config.token}` },
    // 将query参数置空，避免影响获取默认参数
    query: {}
  });

  const repoInfo = res.repoInfo || {};
  this.assert(repoInfo.statusCode === 200, 401, `Personal Access Token Error: ${repoInfo.body.message}`)

  // 仓储信息
  this.repoInfo = this.backData.repoInfo || {};
  // 仓储信息
  this.labelInfo = this.backData.labelInfo || {};
  // 用户信息
  this.userInfo = this.backData.userInfo || {};
  // 管理者信息
  this.ownerInfo = this.backData.ownerInfo || {};
  // 站点信息
  this.siteInfo = Object.assign({
    description: this.repoInfo.description
  }, base.config.site)

}
