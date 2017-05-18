/**!
 * gracejs - test/router.test.js
 * Copyright(c) 2016
 * MIT Licensed
 *
 * Authors:
 *   xiongwilee <xiongwilee@foxmail.com> (http://wilee.me)
 */

'use strict';

var koa = require('koa');
var app = require('../middleware/router/example/app');
var request = require('supertest');
var mm = require('mm');

describe('test/router.test.js', function() {
  afterEach(function() {});

  describe('单级目录多场景测试', function() {
    afterEach(function() {});

    it('generator场景', function(done) {
      request(app)
        .get('/index/generator')
        .expect(200, 'hello world!', done);
    });

    it('async/await场景', function(done) {
      request(app)
        .get('/index/await')
        .expect(200, 'hello world!', done);
    });

    it('bindDefault场景', function(done) {
      request(app)
        .get('/index/bindDefault')
        .expect(200, 'this is defaultCtrl!', done);
    });

    it('method配置场景', function(done) {
      request(app)
        .get('/index/post')
        .expect(200, '这是自定义的404页', done);
    });

    it('regular配置场景', function(done) {
      request(app)
        .get('/index/param/test1/test2')
        .expect(200, {
          id1: 'test1',
          id2: 'test2'
        }, done);
    });
  });

  describe('多级目录多场景测试', function() {
    it('文件夹默认index路由', function(done) {
      request(app)
        .get('/path/index')
        .expect(200, '/path/index', done);
    });
    it('文件夹全路径路由', function(done) {
      request(app)
        .get('/path/index/order')
        .expect(200, '/path/index/order', done);
    });
    it('单文件对象一级路由', function(done) {
      request(app)
        .get('/mult/test1/aj_1')
        .expect(200, '/mult/test1/aj_1', done);
    });
    it('单文件对象二级路由', function(done) {
      request(app)
        .get('/mult/test1/aj_2/aj_2_2')
        .expect(200, '/mult/test1/aj_2/aj_2_2', done);
    });
    it('单文件对象三级路由', function(done) {
      request(app)
        .get('/mult/test1/aj_3/aj_3_1/aj_3_1')
        .expect(200, '这是自定义的404页', done);
    });
    it('单文件对象独立路由', function(done) {
      request(app)
        .get('/mult/test2')
        .expect(200, '/mult/test2', done);
    });
  });

  describe('其他配置测试', function() {
    it('非路由配置', function(done) {
      request(app)
        .get('/notcontroller')
        .expect(200, '这是自定义的404页', done);
    });
  });
});
