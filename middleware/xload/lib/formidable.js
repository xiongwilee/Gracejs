'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');

const debug = require('debug')('koa-grace:xload');
const formidable = require('formidable');

let hashFileExist;

/**
 * formidablePromise
 * @param  {Object}   req      request
 * @param  {Object}   config   配置项，参考：https://github.com/felixge/node-formidable#api
 */
module.exports = function formidablePromise(req, config) {
  return new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm();

    for (let item in config) {
      form[item] = config[item];
    }

    form.parse(req, (err, fields, files) => {
      cbk(err, fields, files, resolve)
    });

    // 用户请求被取消
    form.on('aborted', function() {
      debug('request aborted!');
    });

  });

  /**
   * cbk
   * @param  {Object} err    错误信息
   * @param  {Object} fields 
   * @param  {Object} files  上传的文件
   */
  function cbk(err, fields, files, resolve) {
    let fileList;

    if (err) {
      debug('upload file error:' + err);
    } else {
      try {
        fileList = createFilenameHash(config.uploadDir, files);
        debug('upload file success！');
      } catch (err) {
        fileList = files;
        debug('create filename hash:' + err);
      }
    }

    resolve(fileList);
  }

  /**
   * 创建文件名及对应文件的hash
   * @param  {String} uploadDir 文件保存路径
   * @param  {Obejct} files     文件配置
   */
  function createFilenameHash(uploadDir, files) {
    let hashPath = path.resolve(uploadDir, 'name.json');
    let hashContent;
    let result = [];

    if (hashFileExist || fs.existsSync(hashPath)) {
      try {
        let content = fs.readFileSync(hashPath, 'utf8');
        hashContent = JSON.parse(content);
      } catch (err) {
        debug('get hash file failed:' + err);
      }
    } else {
      hashContent = {};
    }

    for (let item in files) {
      let fileName = files[item].name;
      let hashName = getUniqueId(0, hashContent, fileName);

      let fileItem = getFileItem(files[item], uploadDir)
      hashContent[hashName] = fileItem;
      result.push(util._extend(fileItem, {
        filename: hashName
      }))
    }

    try {
      let file = JSON.stringify(hashContent, null, 2);
      fs.writeFileSync(hashPath, file);
    } catch (err) {
      debug('write hash file failed:' + err);
    }

    hashFileExist = true;

    return result;
  }

  function getFileItem(fileItem, uploadDir) {
    return {
      site: fileItem.size,
      path: fileItem.path.replace(uploadDir, '.'),
      name: fileItem.name,
      type: fileItem.type,
      mtime: fileItem.mtime,
      filename: fileItem.filename
    }
  }

  function getUniqueId(start, hashContent, fileName) {
    if (!hashContent[fileName]) {
      return fileName;
    }
    if (!hashContent[start + '_' + fileName]) {
      return start + '_' + fileName;
    }

    start++;
    return getUniqueId(start, hashContent, fileName);
  }
}
