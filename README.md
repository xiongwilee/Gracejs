<img src="https://github.com/xiongwilee/koa-grace/blob/master/logo.png?raw=true" alt="koa-grace" width="255px" title="A koa MVC framework" alt="A koa multi-app MVC framework"/>

# koa-grace

[![NPM version](https://img.shields.io/npm/v/koa-grace.svg)](https://www.npmjs.com/package/koa-grace)
[![Build Status](https://travis-ci.org/xiongwilee/koa-grace.svg?branch=master)](https://travis-ci.org/xiongwilee/koa-grace)

koa-grace is a new generation Nodejs multi-app MVC framework, which build with KOA / Mongoose etc.

## Getting started

Before getting started ,please make sure you have already installed:
* Nodejs (v4+)
* MongoDB

### Install 

	$ npm install koa-grace-cli -g 
	$ koa-grace -i
	$ cd koa-grace && npm install

### Config 

Open configuration file :

	$ vi config/main.js

Change `config.mongo.blog` to your local mongodb path:

	// mongo configuration
	mongo: {
	  'blog': 'mongodb://localhost:27017/blog'
	}

**more configuration details at [here](https://github.com/xiongwilee/koa-grace/wiki/koa-grace#3-%E8%AF%A6%E7%BB%86%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3)**

### Run
	
	$ npm run dev

And then , you can visit the DEMO at [http://127.0.0.1:3000](http://127.0.0.1:3000/home) .

Or you can visit live DEMO at: http://mlsfe.biz

## Community
 - [Documents](https://github.com/xiongwilee/koa-grace/wiki)
 - [[中文文档]](https://github.com/xiongwilee/koa-grace/wiki/koa-grace) 
 - [ISSUE](https://github.com/xiongwilee/koa-grace/issues)
 - [More examples](https://github.com/xiongwilee/koa-grace/tree/master/app)
 - [what is koa](https://github.com/koajs/koa)

## Authors

  - [Xiongwilee](https://github.com/xiongwilee)

# Gratitude

Thanks for My GirlFriend - Grace Wang

Thanks for Tj's [koa](https://github.com/koajs/koa)

Thanks all

# License

  MIT
