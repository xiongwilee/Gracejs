'use strict';

const path = require('path');
const fs = require('fs');
const co = require('co');
const mongoose = require('mongoose');
const debug = require('debug')('koa-grace:mongo');

mongoose.Promise = global.Promise;

/**
 * 生成mongoose操作方法
 * @param  {string} app     context
 * @param  {object} options 配置项
 *         {string} options.root mongo的model配置路径
 *         {string} options.connect mongo连接路径
 * @return {function}
 *
 * @todo 完善测试用例
 * @todo 优化mongo的接入方式，使其支持：1、单个模块支持多个数据库，2、支持引入插件
 */
module.exports = function graceMongo(app, options) {

  const root = options.root;
  const connect = options.connect;

  // 如果root不存在则直接跳过
  if (!fs.existsSync(root)) {
    debug('error : can\'t find mongo path ' + root);
    return async function mongo(ctx, next) { await next() }
  }

  // 创建数据库连接
  let db = mongoose.createConnection(connect);

  db.on('error', function(err) {
    debug(`error: connect ${connect} ${err}`);
  });
  db.once('open', function() {
    debug(`connect ${connect} success!`);
  });

  let Schema = {},
    Model = {};
  _ls(root).forEach(function(filePath) {
    if (!/.js$/.test(filePath)) {
      return;
    }

    let mod = require(filePath);

    // 创建schema
    let _schema = new mongoose.Schema(mod.schema[0], mod.schema[1]);
    _schema.methods = mod.methods;

    // 发布为Model
    let _model = db.model(mod.model, _schema);

    Schema[mod.model] = _schema;
    Model[mod.model] = _model;
  });

  return async function mongo(ctx, next) {
    if (ctx.mongo) return await next();

    Object.assign(ctx, {
      /**
       * mongo
       * @return {Object} 返回一个Entity对象
       */
      mongo: function(mod, data) {
        if (!Model || !Model[mod]) {
          debug("can't find model : " + mod);
          return;
        }

        return (new Model[mod](data));
      },
      /**
       * mongoMap
       * @param {Array} list mongo请求列表
       *        {Object}    list[].model 模型
       *        {Array}     list[].arg 参数
       *        {Function}  list[].fun 模型方法
       */
      mongoMap: function(list) {
        return Promise.all(list.map(mongoExecMap));

        function mongoExecMap(opt) {
          let arg = opt.arg || [];
          let model = opt.model;
          let fun = opt.fun;

          // 如果fun是generator则转成Promise
          let execfun = (fun.constructor.name === 'GeneratorFunction') ? co.wrap(fun) : fun;

          // fun有可能不是Promise, 利用mongoose中的exec()方法转为promise
          // 参考：http://mongoosejs.com/docs/promises.html
          let execRes = execfun.apply(model, arg);
          return execRes.exec ? execRes.exec() : execRes;
        }
      }
    })

    await next();
  };
}

/**
 * 查找目录中的所有文件
 * @param  {string} dir       查找路径
 * @param  {init}   _pending  递归参数，忽略
 * @param  {array}  _result   递归参数，忽略
 * @return {array}            文件list
 */
function _ls(dir, _pending, _result) {
  _pending = _pending ? _pending++ : 1;
  _result = _result || [];

  if (!path.isAbsolute(dir)) {
    dir = path.join(process.cwd(), dir);
  }

  // if error, throw it
  let stat = fs.lstatSync(dir);

  if (stat.isDirectory()) {
    let files = fs.readdirSync(dir);
    files.forEach(function(part) {
      _ls(path.join(dir, part), _pending, _result);
    });
    if (--_pending === 0) {
      return _result;
    }
  } else {
    _result.push(dir);
    if (--_pending === 0) {
      return _result;
    }
  }
};
