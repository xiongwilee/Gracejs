'use strict'

/**
 * 简易模板引擎，实现配置文件转换为真实数据
 * @param  {object} obj  配置文件
 * @param  {object} data 模板数据
 * @return {object}      真实配置
 */
module.exports = function replace(obj, data) {
  let json = JSON.stringify(obj);

  json = json.replace(/(\$\{)([a-zA-Z0-9-_]+)(\})/g , function(block, pre, val , end){
    return data[val];
  })

  return JSON.parse(json);
}