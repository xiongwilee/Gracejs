#!/usr/bin/env node

var http = require('http');

var debug = require('debug')('koa-grace:server');
var config = global.config =  require('../src/config');

startServer();

/**
 * start server
 */
function startServer(){
  var app = require('../src/app');

  // create server with src/app.js
  var server = http.createServer(app.callback());
  var port = config.site.port;

  // start server with config.site.port
  server.listen(port);

  server.on('error', function (error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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

  server.on('listening', function () {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  });
}