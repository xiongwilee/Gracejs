'use strict';

const base = require('./base.js');

exports.detail = async function() {
  await this.bindDefault();

  let issuesId = parseInt(this.params.id) || 1;

  await this.proxy({
    issue: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues/${issuesId}`
  }, {
    headers: {
      'Authorization': `token ${base.config.token}`,
      // 获取markdown和html，参考：https://developer.github.com/v3/media/#comment-body-properties
      'Accept': 'application/vnd.github.v3.full+json'
    }
  })

  let postInfo = base.getPost(this.backData.issue);
  this.siteInfo.title = `${postInfo.title} - ${this.siteInfo.title}`;

  await this.render('post-detail', {
    constant: {
      issues_id: issuesId,
      html_url: postInfo.html_url
    },
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: postInfo
  })
}

exports.detail.__regular__ = '/:id';

exports.slider = async function() {
  await this.bindDefault();

  let issuesId = parseInt(this.params.id) || 1;

  await this.proxy({
    issue: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues/${issuesId}`
  }, {
    headers: {
      'Authorization': `token ${base.config.token}`,
      // 仅获取markdown原文
      'Accept': 'application/vnd.github.v3.raw+json'
    }
  })

  let postInfo = base.getPost(this.backData.issue);
  this.siteInfo.title = `${postInfo.title} - ${this.siteInfo.title}`;

  await this.render('post-slider', {
    constant: {
      issues_id: issuesId,
      html_url: postInfo.html_url
    },
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: postInfo
  })
}

exports.slider.__regular__ = '/:id';

exports.label = async function() {
  await this.bindDefault();

  let page = parseInt(this.query.page) || 1;
  let label = this.params.id ? this.params.id.toString() : 'blog';

  let res = await this.proxy({
    issues: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues?state=open&filter=created&page=${page}&labels=${label}`
  }, {
    headers: { 'Authorization': `token ${base.config.token}` }
  });

  this.siteInfo.label = label;

  let postInfo = base.getPostList(res.issues);
  Object.assign(postInfo.page, {
    curr: page,
    total: postInfo.page.last || 1
  })

  this.siteInfo.title = `${label} - ${this.siteInfo.title}`;

  await this.render('post-label', {
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: postInfo
  })
}

exports.label.__regular__ = '/:id';

exports.commentsform = async function() {
  let access_token = this.cookies.get(base.config.token_cookie);

  let userInfo;
  if (access_token) {
    let res = await this.proxy({
      userInfo: `github_api:get:user?access_token=${access_token}`
    })
    userInfo = this.backData.userInfo;
  } else {
    let url = this.query.href || '/';
    userInfo = {
      login_url: `/user/login?callback=${encodeURIComponent(url)}`,
      html_url: this.query.html_url
    }
  }

  await this.render('common/post-comments-form', {
    userInfo: userInfo
  })
}

exports.commentslist = async function() {
  let page = parseInt(this.query.page) || 1;
  let issueId = parseInt(this.params.id) || 1;

  let res = await this.proxy({
    // commentsInfo: `github_api:get:/repos/koajs/koa/issues/533/comments?page=${page}`
    commentsInfo: `github_api:get:/repos/${base.config.owner}/${base.config.repo}/issues/${issueId}/comments?page=${page}`
  }, {
    headers: {
      'Authorization': `token ${base.config.token}`,
      // 获取markdown和html，参考：https://developer.github.com/v3/media/#comment-body-properties
      'Accept': 'application/vnd.github.v3.full+json'
    }
  })

  let commentsInfo = base.getCommentsList(res.commentsInfo);

  Object.assign(commentsInfo.page, {
    curr: page,
    total: commentsInfo.page.last || 1
  })

  await this.render('common/post-comments-list', {
    commentsInfo: commentsInfo
  })
}
exports.commentslist.__regular__ = '/:id';
