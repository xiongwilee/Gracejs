#!/usr/bin/env node

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const args = parseArg();
// get config
const config = global.config = require('../src/config')(args);
const debug = require('debug')('koa-grace:server');
// get app
const app = require('../src/app');
// create server with src/app.js
let server = http.createServer(app.callback());
// start server with config.site.port
server.listen(config.site.port);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  let port = config.site.port;
  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
});

/**
 * 通过 process.argv 获取命令行配置项
 * @return {object} 配置项
 */
function parseArg() {
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
