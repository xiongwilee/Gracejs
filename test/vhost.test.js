/**!
 * gracejs - test/vhost.test.js
 * Copyright(c) 2016
 * MIT Licensed
 *
 * Authors:
 *   xiongwilee <xiongwilee@foxmail.com> (http://wilee.me)
 */

'use strict';

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
        .get('/')
        .expect(200, 'Invalid hostname!', done);
    });

    it('命中子目录404页', function(done) {
      request(app)
        .get('/index/')
        .expect(200, '这是自定义的404页', done);
    });

    it('命中子目录hello world!', function(done) {
      request(app)
        .get('/index/generator')
        .expect(200, 'hello world!', done);
    });
  });
});
