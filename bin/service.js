'use strict';

let config = global.config;

let app = require('../src/app');
let http = require('http');
let cluster = require('cluster');

function start() {
  if (cluster.isMaster && !config.site.debug) {
    let numCPUs = require('os').cpus().length;
    
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('death', function(worker) {
      console.log('worker ' + worker.pid + ' died');
      cluster.fork();
    });

    cluster.on('exit', function(worker, code) {
      let st = new Date;
      st = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate() + ' ' + st.toLocaleTimeString();
      console.log('worker ' + worker.process.pid + ' died at:', st);

      // 如果子进程退出，且错误码为1，则不再fork新的子进程
      if (code !== 1) {
        cluster.fork();
      }
    });
  } else {
    let server = http.createServer(app.callback());

    server.listen(config.site.port);

    server.on('error', function(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

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

    server.on('listening', function() {
      let addr = server.address();
      let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
      console.log('Listening on ' + bind);
    });
  }
}

exports.start = start;