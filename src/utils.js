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
