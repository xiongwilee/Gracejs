'use strict';

const fs = require('fs');
const curPath = __dirname;

fs.readdirSync(curPath).forEach((item) => {
  let filePath = `${curPath}/${item}/index.js`;
  if (fs.existsSync(filePath)) {
    exports[item] = require(filePath)
  }
})
