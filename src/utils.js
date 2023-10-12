'use strict';

/**
 * 通过 process.argv 获取命令行配置项
 * @return {object} 配置项
 */
exports.parseArg = function parseArg() {
  let argvs = process.argv;
  let result = {};

  let REG = /^--[a-zA-Z0-9]+=[a-zA-Z0-9]+$/;

  argvs.map(function(item) {
    if (!REG.test(item)) return;

    let arr = item.split('=');
    let key = arr[0].slice(2);

    result[key] = arr[1];
  });

  return result;
};


/**
 * 取叶子节点
 * @return {object} 配置项
 */
exports.extendTwoObj = function extendTwoObj(oriObj, newObj, cb) {
  function getLeafNodes(obj, ori, key) {
    if (!obj) return;

    if (typeof obj === 'object' &&!Array.isArray(obj)) {
      // 如果是对象并且不是数组
      Object.keys(obj).forEach(newKey => {
        // 遍历对象的每个键
        let newOri;
        if (key === undefined) {
          newOri = ori;
        } else {
          ori[key] = ori[key] || {};
          newOri = ori[key];
        }

        getLeafNodes(obj[newKey], newOri, newKey);
      });
    } else {
      // 如果是数组或者不是对象
      // 如果有回调先执行回调, 再取值
      if(cb) { 
        let cbObj = cb(obj);
        if(cbObj === undefined ) return;

        return ori[key] = cbObj;
      }
      
      // 如果没有直接赋值
      return ori[key] = obj;
    }
  }

  getLeafNodes(newObj, oriObj);

  return oriObj;
}