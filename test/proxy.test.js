/**!
 * gracejs - test/proxy.test.js
 * Copyright(c) 2016
 * MIT Licensed
 *
 * Authors:
 *   xiongwilee <xiongwilee@foxmail.com> (http://wilee.me)
 */

'use strict';

var koa = require('koa');
var app = require('../middleware/proxy/example/app');
var request = require('supertest');
var mm = require('mm');

describe('test/proxy.test.js', function() {
  afterEach(function() {});

  describe('this.proxy方法测试', function() {
    afterEach(function() {});

    it('直接代理请求测试', function(done) {
      request(app)
        .get('/test/case/baidu_url')
        .expect(200, done);
    });

    it('通过API代理GET请求测试', function(done) {
      request(app)
        .get('/test/case/baidu_api_get')
        .expect(200, done);
    });

    it('通过API代理POST请求测试', function(done) {
      request(app)
        .get('/test/case/baidu_api_post')
        .expect(200, done);
    });
  });
});
