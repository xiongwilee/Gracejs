/**!
 * gracejs - test/vhost.test.js
 * Copyright(c) 2016
 * MIT Licensed
 *
 * Authors:
 *   xiongwilee <xiongwilee@foxmail.com> (http://wilee.me)
 */

'use strict';

/**
 * Module dependencies.
 */
require("babel-register");

var koa = require('koa');
var app = require('../middleware/vhost/example/app');
var request = require('supertest');
var mm = require('mm');

describe('test/vhost.test.js', function() {
  afterEach(function() {});

  describe('vhost命中测试', function() {
    afterEach(function() {});

    it('vhost访问阻断', function(done) {
      request(app)
        .get('/index/generator')
        .expect(200, 'error: there is no host matched!', done);
    });
  });
});
