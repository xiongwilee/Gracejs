'use strict';

const fs = require('fs');
const path = require('path');
const send = require('koa-send');

const debug = require('debug')('koa-grace:xload');

let existhashFile = false;

module.exports = function sendfile(ctx, filename, config) {

  let hashFilePath = path.resolve(config.downloadDir, 'name.json');
  let hashContent;

  if (existhashFile || fs.existsSync(hashFilePath)) {
    existhashFile = true;
    try {
      let file = fs.readFileSync(hashFilePath, 'utf8');
      hashContent = JSON.parse(file);
    } catch (err) {
      debug('get hash file error!');
    }
  }

  if (!hashContent || !hashContent[filename]) {
    return function() {}
  }

  let filePath = hashContent[filename].path;
  
  return send(ctx, filePath, {
    root: config.downloadDir
  });
}
