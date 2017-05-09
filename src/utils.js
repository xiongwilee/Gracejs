'use strict';

/**
 * 简易模板引擎，实现配置文件转换为真实数据
 * @param  {object} obj  配置文件
 * @param  {object} data 模板数据
 * @return {object}      真实配置
 */
exports.replace = function replace (obj, data) {
  let json = JSON.stringify(obj);

  json = json.replace(/(\$\{)([a-zA-Z0-9-_]+)(\})/g , function(block, pre, val , end){
    return data[val];
  })

  return JSON.parse(json);
}

/**
 * 深度merge对象
 * @param  {object} dest 要merge到的对象
 * @param  {object} src  要从这个对象merge
 * @return {object}      merge后的对象
 */
exports.merge = function merge (dest, src) {
  function isLast(obj) {
    if (Object.prototype.toString.call(obj) == '[object Object]') {
      let ret = false;
      for (var key in obj) {
        ret = obj.key === undefined ? ret : true;
      }
      return ret;
    } else {
      return true;
    }
  }

  function update(obj, key, last, value) {
    let keys = key.split('.');
    let now = obj;
    keys.forEach(item => {
      now = now[item];
    });
    now[last] = value;
  }

  let index = -1;
  let lines = [{
    old: dest,
    obj: src,
    key: ''
  }];

  if (isLast(src)) return dest;

  while (index < lines.length - 1) {
    index ++;
    let item = lines[index];
    for (var k in item.obj) {
      if (isLast(item.obj[k]) || item.old[k] === undefined) {
        update(dest, item.key, k, item.obj[k]);
      } else {
        lines.push({
          old: item.old[k],
          obj: item.obj[k],
          key: item.key + (item.key ? '.' : '') + k
        });
      }
    }
  }

  return dest
}

/**
 * 实现配置文件转换为真实数据
 * @param  {object} obj  配置文件
 * @param  {object} data 模板数据
 * @return {object}      真实配置
 */
exports.makeConfig = function makeConfig (obj, data) {
  if (data.merge) {
    obj = exports.merge(obj, data.merge);
  }
  return exports.replace(obj, data);
}

/**
 * 通过 process.argv 获取命令行配置项
 * @return {object} 配置项
 */
exports.parseArg = function parseArg() {
  let argvs = process.argv;
  let result = {};

  let REG = /^--[a-zA-Z0-9]+\=[a-zA-Z0-9]+$/;

  argvs.map(function(item) {
    if (!REG.test(item)) {
      return
    }

    let arr = item.split('=');
    let key = arr[0].slice(2);

    result[key] = arr[1];
  })

  return result;
}
