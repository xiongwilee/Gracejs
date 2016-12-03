#!/usr/bin/env node

'use strict';

global.Promise = require('bluebird')
require("babel-register");


const http = require('http');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('koa-grace:server');
const utils = require('../src/utils');

const args = utils.parseArg();
const config = global.config = require('../src/config')(args);

let app = require('../src/app');
let server = require('http').createServer(app.callback());

server.listen(3000);
