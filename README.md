<img src="https://github.com/xiongwilee/koa-grace/blob/master/logo.png?raw=true" alt="koa-grace" width="255px" />

# koa-grace

koa-grace is a new generation Nodejs multi-app MVC framework, which build with KOA / Mongoose etc.

## Getting started

Before getting started ,please make sure you have already installed:
* Nodejs (v4+)
* MongoDB

### Install 

	$ git clone https://github.com/xiongwilee/koa-grace.git 
	$ cd koa-grace && npm install

### Config 

Open configuration file :

	$ vi config/main.js

Change `config.mongo.blog` to your local mongodb path:

	// mongo configuration
	mongo: {
	  'blog': 'mongodb://localhost:27017/blog'
	}

**more configuration details at [here](docs/documents.md#config)**

### Run
	
	$ npm run dev

And then , you can visit the DEMO at [http://127.0.0.1:3000](http://127.0.0.1:3000/home) .

Or you can visit live DEMO at: http://mlsfe.biz

## Community
 - [Documents](https://github.com/xiongwilee/koa-grace/wiki)
 - [[中文文档]](https://github.com/xiongwilee/koa-grace/wiki/koa-grace%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3) 
 - [Contribution](https://github.com/xiongwilee/koa-grace/wiki/Contribution)
 - [More examples](https://github.com/xiongwilee/koa-grace/tree/master/app)
 - [what is koa](https://github.com/koajs/koa)

## Authors

  - [Xiongwilee](https://github.com/xiongwilee)

# License

  MIT
