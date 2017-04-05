'use strict';

const base = require('./base.js');

module.exports = {
  'user': {
    info: async function() {
      let access_token = this.cookies.get(base.config.token_cookie);

      await this.proxy(`github_api:get:user?access_token=${access_token}`);
    }
  },
  'comments': {
    create: async function() {
      let access_token = this.cookies.get(base.config.token_cookie);

      let issueId = parseInt(this.request.body.issues_id) || 1;

      await this.proxy(`github_api:post:/repos/${base.config.owner}/${base.config.repo}/issues/${issueId}/comments`, {
        headers: { 'Authorization': `token ${access_token}` }
      })
    },
    list: async function() {
      let issueId = parseInt(this.query.issues_id) || 1;

      await this.proxy(`github_api:get:/repos/${base.config.owner}/${base.config.repo}/issues/${issueId}/comments`, {
        headers: { 'Authorization': `token ${base.config.token}` }
      })
    }
  }
}
