/**!
 * gracejs - test/body.test.js
 * Copyright(c) 2016
 * MIT Licensed
 *
 * Authors:
 *   xiongwilee <xiongwilee@foxmail.com> (http://wilee.me)
 */

'use strict';

var koa = require('koa');
var app = require('../middleware/body/example/app');
var request = require('supertest');
var mm = require('mm');

describe('test/body.test.js', function() {
  afterEach(function() {});

  describe('json body', function() {
    it('解析json body测试', function(done) {
      request(app)
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' }, done);
    });

    it('解析json-api headers测试', function(done) {
      request(app)
        .post('/')
        .set('Accept', 'application/vnd.api+json')
        .set('Content-type', 'application/vnd.api+json')
        .send('{"foo": "bar"}')
        .expect({ foo: 'bar' }, done);
    });
  });

  describe('form body', function() {
    it('解析parse form body测试', function(done) {
      request(app)
        .post('/')
        .type('form')
        .send({ foo: { bar: 'baz' } })
        .expect({ foo: { bar: 'baz' } }, done);
    });
  });
});
