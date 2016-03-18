'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');

let config = require('../config/main');
let extendConfig = {};

if (config.extend) {
  
  let extPath = path.resolve(config.extend);

  extendConfig = fs.existsSync(extPath) ? require(extPath) : extendConfig;
}

module.exports = global.config = util._extend(config, extendConfig);
