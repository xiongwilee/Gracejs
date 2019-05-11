/**!
 * gracejs - test/views.test.js
 * Copyright(c) 2019
 * MIT Licensed
 *
 * Authors:
 *   hezai
 */

'use strict';

var koa = require('koa');
var app = require('../middleware/views/example/app');
var request = require('supertest');
var mm = require('mm');

describe('test/views.test.js', function() {
  afterEach(function() {});

  describe('set DefaultCtrlData', function() {
    it('页面渲染', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    });

    it('设置模板渲染全局变量', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if(/this is defaultCtrlData/.test(res.text)) {
            done();
          }
        });
    });
  });
});
