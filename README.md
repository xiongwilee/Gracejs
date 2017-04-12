<p align="center"><img width="30%" src="http://img002.qufenqi.com/products/0e/64/0e648f3e91454d406b3ac8a2941ad15f.png" /></p>

--------------------------------------------------------------------------------

> koa-grace v1.x版本请移步： https://github.com/xiongwilee/koa-grace/tree/v1.0.4

# koa-grace v2

[Gracejs](https://github.com/xiongwilee/koa-grace)(又称:koa-grace v2)  是全新的基于[koa v2.x](https://github.com/koajs/koa)的MVC+RESTful架构的前后端分离框架。

[![NPM version](https://img.shields.io/npm/v/gracejs.svg)](https://www.npmjs.com/package/gracejs)
[![Build Status](https://travis-ci.org/xiongwilee/koa-grace.svg?branch=master)](https://travis-ci.org/xiongwilee/koa-grace)

## 一、简介

Gracejs是[koa-grace](https://github.com/xiongwilee/koa-grace)的升级版，也可以叫koa-grace v2。

主要特性包括：

1. 支持MVC架构，可以更便捷地生成服务端路由；
2. 标准的RESTful架构，支持后端接口异步并发，页面性能更优；
3. 一套Node环境经服务服务多个站点应用，部署更简单；
4. 优雅的MOCK功能，开发环境模拟数据更流畅；
5. 完美支持async/await及generator语法，随心所欲；
6. 更灵活的前端构建选型，想用什么就用什么，随你所愿。

相比于koa-grace v1（以下简称：koa-grace）：**Gracejs完美支持koa v2**，同时做了优化虚拟host匹配和路由匹配的性能、还完善了部分测试用例等诸多升级。当然，如果你正在使用koa-grace也不用担心，我们会把Gracejs中除了支持koa2的性能和功能特性移植到koa-grace的相应中间件中。

这里不再介绍“前后端分离”、“RESTful”、“MVC”等概念，有兴趣可参考[趣店前端团队基于koajs的前后端分离实践](http://feclub.cn/post/content/qudian_koa)一文。

Gracejs及前后端分离问题交流群：
* **QQ交流群**：368463457 <img src="http://img002.qufenqi.com/products/aa/68/aa68a9b93005550be70e1bac6af22114.jpeg" width="180px" /> 
* **微信交流群**： 待建

## 二、快速开始

**注意：请确保你的运行环境中Nodejs的版本至少是`v7.6.0`** 
（或者你也可以考虑支持 Nodejs v4.x+ 的[koa-grace v1.x](https://github.com/xiongwilee/koa-grace/tree/v1.0.4)）

### 安装

执行命令：
```shell
$ git clone https://github.com/xiongwilee/koa-grace.git
$ cd koa-grace && npm install
```

**BTW: 由于众所周知的原因，npm install可能不稳定，推荐使用[cnpm](https://github.com/cnpm/cnpm#cnpm)安装。**

### 运行

然后，执行命令：
```shell
$ npm run dev
```

然后访问：[http://127.0.0.1:3000](http://127.0.0.1:3000/) 就可以看到示例了！

## 三、案例说明

这里参考 https://github.com/xiongwilee/koa-grace 中`app/demo`目录下的示例，详解Gracejs的MVC+RESTful架构的实现。

此前也有文章简单介绍过koa-grace的实现（ https://github.com/xiongwilee/koa-grace/wiki ），但考虑到Gracejs的差异性，这里再从**目录结构**、**MVC模型实现**、**proxy机制**这三个关键点做一些比较详细的说明。

### 目录结构

Gracejs与koa-grace v1.x版本的目录结构完全一致：

```shell
.
├── controller
│   ├── data.js
│   ├── defaultCtrl.js
│   └── home.js
├── static
│   ├── css
│   ├── image
│   └── js
└── views
    └── home.html
```

其中：

* `controller`用以存放路由及控制器文件
* `static`用以存放静态文件
* `views`用以存放模板文件

需要强调的是，**这个目录结构是生产环境代码的标准目录结构。在开发环境里你可以任意调整你的目录结构，只要保证编译之后的产出文件以这个路径输出即可**。

如果你对这一点仍有疑问，可以参考: [前端构建-Boilerplate](https://github.com/xiongwilee/koa-grace#boilerplate)

### MVC模型实现

为了满足更多的使用场景，在Gracejs中加入了简单的Mongo数据库的功能。

但准确的说，前后端的分离的Nodejs框架都是VC架构，并没有Model层。因为**前后端分离框架不应该有任何数据库、SESSION存储的职能**。

![mvc](https://raw.githubusercontent.com/xiongwilee/demo/master/photo/mvc-%E5%89%8D%E5%90%8E%E7%AB%AF%E5%88%86%E7%A6%BB.jpg)

如上图，具体流程如下：

* 第一步，Nodejs server（也就是Gracejs服务）监听到用户请求；
* 第二步，Gracejs的各个中间件（Middlewares）对请求上下文进行处理；
* 第三步，根据当前请求的path和method，进入对应的Controller；
* 第四步，通过http请求以proxy的模式向后端获取数据；
* 第五步，拼接数据，渲染模板。

这里的第四步，proxy机制，就是Gracejs实现前后端分离的核心部分。

### proxy机制

以实现一个电商应用下的“个人中心”页面为例。假设这个页面的首屏包括：用户基本信息模块、商品及订单模块、消息通知模块。

后端完成服务化架构之后，这三个模块可以解耦，拆分成三个HTTP API接口。这时候就可以通过Gracejs的`this.proxy`方法，去后端异步并发获取三个接口的数据。

如下图：

![proxy](https://raw.githubusercontent.com/xiongwilee/demo/master/photo/proxy-%E5%89%8D%E5%90%8E%E7%AB%AF%E5%88%86%E7%A6%BB.jpg)

这样有几个好处：

1. 在Nodejs层（服务端）异步并发向后端（服务端）获取数据，可以使HTTP走内网，性能更优；
2. 后端的接口可以同时提供给客户端，实现接口给Web+APP复用，后端开发成本更低；
3. 在Nodejs层获取数据后，直接交给页面，不管前端用什么技术栈，可以使首屏体验更佳。

那么，这么做是不是就完美了呢？肯定不是：

1. 后端接口在外网开放之后，如何保证接口安全性？
2. 如果当前页面请求是GET方法，但我想POST到后端怎么办？
3. 我想在Controller层重置post参数怎么办？
4. 后端接口设置cookie如何带给浏览器？
5. 经过一层Nodejs的代理之后，如何保证SESSION状态不丢失？
6. 如果当前请求是一个file文件流，又该怎么办呢？
...

好消息是，这些问题在proxy中间件中都考虑过了。这里不再一一讲解，有兴趣可以看koa-grace-proxy的源码：https://github.com/xiongwilee/koa-grace/middleware/proxy 。

## 四、详细使用手册

在看详细使用手册之前，建议先看一下Gracejs的主文件源码：https://github.com/xiongwilee/koa-grace/blob/master/src/app.js 。

这里不再浪费篇幅贴代码了，其实想说明的就是：**Gracejs是一个个关键中间件的集合**。

所有中间件都在[middleware](https://github.com/xiongwilee/koa-grace/middleware)目录下，配置由`config/main.*.js`管理。

关于配置文件：

1. 配置文件extend关系为：config/server.json的merge字段 > config/main.*.js > config.js；
2. 配置生成后保存在Gracejs下的全局作用域`global.config`里，方便读取。

下面介绍几个关键中间件的作用和使用方法。

### vhost——多站点配置

`vhost`在这里可以理解为，一个Gracejs server服务于几个站点。Gracejs支持通过`host`及`host`+`一级path`两种方式的**映射**。所谓的隐射，其实就是一个域名（或者一个域名+一级path）对应一个应用，一个应用对应一个目录。

**注意：考虑到正则的性能问题，vhost不会考虑正则映射**。

参考`config/main.development.js`，可以这么配置vhost：

```javascript
// vhost配置
vhost: {
  '127.0.0.1':'demo',
  '127.0.0.1/test':'demo_test',
  'localhost':'blog',
}
```

其中，`demo`,`demo_test`,`blog`分别对应`app/`下的三个目录。当然你也可以指定目录路径，在配置文件中修改`path.project`配置即可：
```javascript
// 路径相关的配置
path: {
  // project
  project: './app/'
}
```

### router——路由及控制器

Gracejs中生成路由的方法非常简单，以自带的demo模块为例，进入demo模块的controller目录：`app/demo/controller`。

文件目录如下：
```
controller
├── data.js
├── defaultCtrl.js
└── home.js
```

#### 1、 文件路径即路由

router中间件会找到模块中所有以`.js`结尾的文件，根据文件路径和module.exports生成路由。

例如，demo模块中的home.js文件：
```javascript
exports.index = async function () {
  await this.bindDefault();
  await this.render('home', {
    title: 'Hello , Grace!'
  });
}
exports.hello = function(){
  this.body = 'hello world!'
}
```
则生成`/home/index`、`/home`、`/home/hello`的路由。需要说明几点：

1. 如果路由是以`/index`结尾的话，Gracejs会"赠送"一个去掉`/index`的同样路由；
2. 如果当前文件是一个依赖，仅仅被其他文件引用；则在文件中配置`exports.__controller__ = false`，该文件就不会生成路由了；参考`defaultCtrl.js`
3. 这里的控制器函数可以是`await/async`或`generator`函数，也可以是一个普通的函数；Gracejs中推荐使用`await/async`；
4. 这里的路由文件包裹在一个目录里也是可以的，可以参考：`app/blog`中的controller文件；
5. 如果当前文件路由就是一个独立的控制器，则`module.exports`返回一个任意函数即可。

最后，如果用户访问的路由查找不到，router会默认查找`/error/404`路由，如果有则渲染`error/404`页（不会重定向到`error/404`），如果没有则返回404。
 
#### 2、 路由文件使用说明

将demo模块中的home.js扩展一下：

```javascript
exports.index = async function () {
    ...
}
exports.index.__method__ = 'get';
exports.index.__regular__ = null;
```

另外，需要说明以下几点：

* 如果需要配置dashboard/post/list请求为`DELETE`方法，则post.js中声明 `exports.list.__method__ = 'delete'`即可（**不声明默认注入get及post方法**）;
* 如果要配置更灵活的路由，则中声明`exports.list.__regular__ = '/:id';`即可，然后在控制器中通过`this.params.id`获取ID值，更多相关配置请参看：[koa-router#named-routes](https://github.com/alexmingoia/koa-router#named-routes)
* 需要注意的是：如果`__regular__`配置为正则表达式的话，则会生成当前控制器默认路由及正则可匹配的路由

当然，如果路由文件中的所有控制器方法都是post方法，您可以在控制器文件最底部加入：`module.exports.__method__ = 'post'`即可，`__regular__`的配置同理。

**注意：一般情况这里不需要额外的配置，为了保证代码美观，没有特殊使用场景的话就不要写`__method__`和`__regular__`配置。**

#### 3、 控制器

将demo模块中的home.js的index方法再扩展一下：
```javascript
exports.index = async function () {
  // 绑定默认控制器方法
  await this.bindDefault();
  // 获取数据
  await this.proxy(...)
  // 渲染目标引擎
  await this.render('home', {
    title: 'Hello , Grace!'
  });
}
```

它就是一个标准的控制器（controller）了。这个控制器的作用域就是当前koa的context，你可以任意使用koa的context的任意方法。

几个关键context属性的使用说明如下：

**koa自带：**

更多koa自带context属性，请查看koajs官网：http://koajs.com/ 

context属性 | 类型 | 说明
---------- | ---- | ------------------
`this.request.href` | `String` | 当前页面完整URL，也可以简写为`this.href`
`this.request.query` | `object` | get参数，也可以简写为`this.query`
`this.response.set` | `function` | 设置response头信息，也可以简写为`this.set`
`this.cookies.set` | `function` | 设置cookie，参考：[cookies](https://github.com/pillarjs/cookies#cookiesset-name--value---options--)
`this.cookies.get` | `function` | 获取cookie，参考：[cookies](https://github.com/pillarjs/cookies#cookiesget-name--options--)

**Gracejs注入：**

context属性 | 类型 | 中间件 | 说明
---------- | ---- | ----- | ------------------
`this.bindDefault` | `function` | router | 公共控制器，相当于`require('app/*/controller/defaultCtrl.js')`
`this.request.body` | `object` | body | post参数，可以直接在this.request.body中获取到post参数
`this.render` | `function` | views | 模板引擎渲染方法，请参看： 模板引擎- Template engine
`this.mongo` | `function` | mongo | 数据库操作方法，请参看： 数据库 - Database
`this.mongoMap` | `function` | mongo | 并行数据库多操作方法，请参看： 数据库 - Database
`this.proxy` | `function` | proxy | RESTful数据请求方法，请参看：数据代理
`this.fetch` | `function` | proxy | 从服务器导出文件方法，请参看： 请求代理
`this.backData` | `Object` | proxy | 默认以Obejct格式存储this.proxy后端返回的JSON数据
`this.upload` | `function` | xload | 文件上传方法，请参看： 文件上传下载
`this.download` | `function` | xload | 文件下载方法，请参看： 文件上传下载

#### 4、控制器中异步函数的写法

在控制器中，如果还有其他的异步方法，可以通过Promise来实现。例如：

```javascript
exports.main = async function() {
  await ((test) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve(test) }, 3000)
    });
  })('测试')
}
```

### proxy——数据代理

Gracejs支持两种数据代理场景：

1. 单纯的数据代理，任意请求到后端接口，然后返回json数据（也包括文件流请求到后端，后端返回json数据）；
2. 文件代理，请求后端接口，返回一个文件（例如验证码图片）；

下面逐一介绍两种代理模式的使用方法。

#### 1、 数据代理

数据代理可以在控制器中使用`this.proxy`方法：

```javascript
this.proxy(object|string,[opt])
```

##### 使用方法

`this.proxy` 方法返回的是一个Promise，所以这里你可以根据当前Controller的类型使用`async/await`或者`Generator`实现异步并发。例如：

**async/await：**

```javascript
exports.demo = async function () {
  await this.proxy({ /* ... */ })
}
```

**Generator：**

```javascript
exports.demo = function * () {
  yield this.proxy({ /* ... */ })
}
```

为了使语法更简便，可以在执行`this.proxy`之后，直接在上下文中的`backData`字段中获取到数据。例如：

```javascript
exports.demo = async function () {
  await this.proxy({
    userInfo:'github:post:user/login/oauth/access_token?client_id=****',
    otherInfo:'github:other/info?test=test',
  })
  
  console.log(this.backData);
  /**
   *  {
   *    userInfo : {...},
   *    otherInfo : {...}
   *  }
   */
}
```

`Generator`方法亦然。

此外，如果要获取proxy的请求头信息，你可以在proxy方法返回的内容中获取到，例如：

```javascript
exports.demo = async function (){
  let res = await this.proxy({
    userInfo:'github:post:user/login/oauth/access_token?client_id=****',
    otherInfo:'github:other/info?test=test',
  });
  
  console.log(res);
  /**
   *  {
   *    userInfo : {
   *      statusCode: {...} // 返回http status code
   *      request: {...}    // 请求体
   *      headers: {...}    // 响应头信息
   *      body: {...}       // 未处理的response body
   *    },
   *    otherInfo : {...}
   *  }
   */
}
```

##### 使用场景一：多个数据请求的代理

可以发现，上文的案例就是多个数据同时请求的代理方案，这里也就是**异步并发**获取数据的实现。使用`this.proxy`方法实现多个数据异步并发请求非常简单：

```javascript
exports.demo = async function (){
  await this.proxy({
    userInfo:'github:post:user/login/oauth/access_token?client_id=****',
    otherInfo:'github:other/info?test=test',
  });
  
  console.log(this.backData);
  /**
   *  {
   *    userInfo : {...},
   *    otherInfo : {...}
   *  }
   */
}
```

然后，proxy的结果会默认注入到上下文的`this.backData`对象中。



##### 使用场景二：单个数据请求的代理

如果只是为了实现一个接口请求代理，可以这么写：

```javascript
exports.demo = async function (){
  await this.proxy('github:post:user/login/oauth/access_token?client_id=****');
}
```

这样proxy请求返回的数据体会直接赋值给`this.body`，也就是将这个请求直接返回给客户端。

##### 说明

`github:post:user/login/oauth/access_token?client_id=****`说明如下：

* `github`： 为在`config/main.*.js`的 `api` 对象中进行配置；
* `post` ： 为数据代理请求的请求方法，该参数可以不传，默认为`get`
* `path`： 后面请求路径中的query参数会覆盖当前页面的请求参数（this.query），将query一同传到请求的接口
* 你也可以写完整的路径：`{userInfo:'https://api.github.com/user/login?test=test'}`

另外，`this.proxy`的形参说明如下：

 参数名 | 类型 | 默认 | 说明
 ----- | --- | ---- | ----
 `dest` | `Object` | `this.backData` | 指定接收数据的对象，默认为`this.backData`
 `conf` | `Obejct` | `{}` | this.proxy使用[Request.js](https://github.com/request/request)实现，此为传给request的重置配置（你可以在这里设置接口超时时间：`conf: { timeout: 25000 }`）
 `form` | `Object` | `{}` | 指定post方法的post数据，默认为当前页面的post数据，这里的数据content-type会根据当前请求的类型指定
 `headers` | `Object` | `{}` | 指定当前请求的headers

关于this.proxy方法还有很多有趣的细节，推荐有兴趣的同学看源码：https://github.com/xiongwilee/koa-grace/middleware/proxy

#### 2、 文件代理

文件代理可以在控制器中使用`this.fetch`方法：

```javascript
this.fetch(string)
```

文件请求代理也很简单，比如如果需要从github代理一个图片请求返回到浏览器中，参考：http://feclub.cn/user/avatar?img=https://avatars.githubusercontent.com/u/1962352?v=3 ， 或者要使用导出文件的功能：

```javascript
exports.avatar = async function (){
  await this.fetch(imgUrl);
}
```

这里需要注意的是：**在this.fetch方法之后会直接结束response， 不会再往其他中间件执行**。

### views——视图层

默认的模板引擎为[swig](paularmstrong.github.io/swig/)，但swig作者已经停止维护；你可以在`config/main.*.js`中配置`template`属性想要的模板引擎：

```javascript
// 模板引擎配置
template: 'nunjucks'
```

你还可以根据不同的模块配置不同的模板引擎：
```javascript
template: {
  blog:'ejs'
}
```

目前支持的模板引擎列表在这里：[consolidate.js#supported-template-engines](https://github.com/tj/consolidate.js#supported-template-engines)

在控制器中调用`this.render`方法渲染模板引擎：

```javascript
exports.home = await function () {
  await this.render('dashboard/site_home',{
    breads : ['站点管理','通用'],
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}
```

模板文件在模块路径的`/views`目录中。

注意一点：Gracejs渲染模板时，默认会将`main.*.js`中constant配置交给模板数据；这样，如果你想在页面中获取公共配置（比如：CDN的地址）的话就可以在模板数据中的`constant`子中取到。

### static——静态文件服务

静态文件的使用非常简单，将`/static/**/`或者`/*/static/*`的静态文件请求代理到了模块路径下的`/static`目录：

```javascript
// 配置静态文件路由
app.use(Middles.static(['/static/**/*', '/*/static/**/*'], {
  dir: config_path_project,
  maxage: config_site.env == 'production' && 60 * 60 * 1000
}));
```

以案例中`blog`的静态文件为例，静态文件在blog项目下的路径为：`app/blog/static/image/bg.jpg`，则访问路径为http://127.0.0.1/blog/static/image/bg.jpg 或者 http://127.0.0.1/static/blog/image/bg.jpg

注意两点：

1. 静态文件端口和当前路由的端口一致，所以`/static/**/`或者`/*/static/*`形式的路由会是无效的；
2. 推荐在生产环境中，使用Nginx做静态文件服务，购买CDN托管静态文件；

### mock——Mock数据

MOCK功能的实现其实非常简单，在开发环境中你可以很轻易地使用MOCK数据。

以demo模块为例，首先在`main.development.js`配置文件中添加proxy配置：
```javascript
// controller中请求各类数据前缀和域名的键值对
api: {
 // ...
 demo: 'http://${ip}:${port}/__MOCK__/demo/'
 // ...
}
```

然后，在demo模块中添加`mock`文件夹，然后添加`test.json`:

**文件结构：**
```shell
.
├── controller
├── mock
|     └── test.json
├── static
└── views
```
**文件内容（就是你想要的请求返回内容）：**

在JSON文件内容中也可以使用注释：
```javascript
/*
 * 获取用户信息接口
 */
{
    code:0 // 这是code
}
```

然后，你可以打开浏览器访问：`http://${ip}:${port}/__MOCK__/demo/test` 验证是否已经返回了test.json里的数据。

最后在你的controller业务代码中就可以通过proxy方法获取mock数据了：
```javascript
this.proxy({
    test:'demo:test'
})
```

**注意：**

* 如果你的mock文件路径是/mock/test/subtest.json 那么proxy路径则是：test/subtest;
* 强烈建议将mock文件统一为真正的后端请求路径，这样以实现真实路径的mock；

可以参考这个：[koa-grace中的mock功能的示例](https://github.com/xiongwilee/koa-grace/blob/master/app/demo/controller/data.js)

### secure——安全模块

考虑到用户路由完全由Nodejs托管以后，CSRF的问题也得在Nodejs层去防护了。此前写过一片文章：[前后端分离架构下CSRF防御机制](http://feclub.cn/post/content/koa-grace-csrf)，这里就只写使用方法，不再详述原理。

在Gracejs中可以配置：
```javascript
// csrf配置
csrf: {
  // 需要进行xsrf防护的模块名称
  module: []
}
```

然后，在业务代码中，获取名为：`grace_token`的cookie，以post或者get参数回传即可。当然，如果你不想污染ajax中的参数对象，你也可以将这个cookie值存到`x-grace-token`头信息中。

Gracejs监听到post请求，如果token验证失效，则直接返回错误。

### mongo——简单的数据库

> 请注意：不推荐在生产环境中使用数据库功能

在Gracejs中使用mongoDB非常简单，当然没有做过任何压测，可能存在性能问题。

#### 1、 连接数据库

在配置文件`config/main.*.js`中进行配置：

```javascript
  // mongo配置
  mongo: {
    options:{
      // mongoose 配置
    },
    api:{
      'blog': 'mongodb://localhost:27017/blog'
    }
  },
```

其中，`mongo.options`配置mongo连接池等信息，`mongo.api`配置站点对应的数据库连接路径。

值得注意的是，**配置好数据库之后，一旦koa-grace server启动mongoose就启动连接，直到koa-grace server关闭**

#### 2、 mongoose的schema配置

依旧以案例`blog`为例，参看`app/blog/model/mongo`目录：

```shell
└── mongo
    ├── Category.js
    ├── Link.js
    ├── Post.js
    └── User.js
```

一个js文件即一个数据库表即相关配置，以`app/blog/model/mongo/Category.js`：

```javascript
'use strict';

// model名称，即表名
let model = 'Category';

// 表结构
let schema = [{
  id: {type: String,unique: true,required: true},
  name: {type: String,required: true},
  numb: {type: Number,'default':0}
}, {
  autoIndex: true,
  versionKey: false
}];

// 静态方法:http://mongoosejs.com/docs/guide.html#statics
let statics = {}

// 方法扩展 http://mongoosejs.com/docs/guide.html#methods
let methods = {
  /**
   * 获取博客分类列表
   */
  list: function* () {
    return this.model('Category').find();
  }
}

module.exports.model = model;
module.exports.schema = schema;
module.exports.statics = statics;
module.exports.methods = methods;
```

主要有四个参数：

*  `model` ， 即表名，最好与当前文件同名
*  `schema` ， 即mongoose schema
*  `methods` ， 即schema扩展方法，**推荐把数据库元操作都定义在这个对象中**
*  `statics` ， 即静态操作方法

#### 3、 在控制器中调用数据库

在控制器中使用非常简单，主要通过`this.mongo`,`this.mongoMap`两个方法。

##### 1） `this.mongo(name)` 

调用mongoose Entity对象进行数据库CURD操作

**参数说明:**

`@param [string] name` : 在`app/blog/model/mongo`中配置Schema名，

**返回:**

`@return [object]` 一个实例化Schema之后的Mongoose Entity对象，可以通过调用该对象的methods进行数据库操作

**案例**

参考上文中的Category.js的配置，以`app/blog/controller/dashboard/post.js`为例，如果要在博客列表页中获取博客分类数据：

```javascript
// http://127.0.0.1/dashboard/post/list
exports.list = async function (){
  let cates = await this.mongo('Category').list();
  this.body = cates;
}
```

##### 2）`this.mongoMap(option)`

并行多个数据库操作

**参数说明**

`@param [array] option` 

`@param [Object] option[].model`  mongoose Entity对象，通过this.mongo(model)获取

`@param [function] option[].fun`  mongoose Entity对象方法

`@param [array] option[].arg`  mongoose Entity对象方法参数

**返回**

`@return [array]` 数据库操作结果，以对应数组的形式返回

**案例**

```javascript
  let PostModel = this.mongo('Post');
  let mongoResult = await this.mongoMap([{
      model: PostModel,
      fun: PostModel.page,
      arg: [pageNum]
    },{
      model: PostModel,
      fun:PostModel.count,
      arg: [pageNum]
    }]);

  let posts = mongoResult[0];// 获取第一个查询PostModel.page的结果
  let page = mongoResult[1]; // 获取第二个查询PostModel.count的结果，两者并发执行
```

### xload——文件上传下载

> 请注意：不推荐在生产环境中使用文件上传下载功能

与数据库功能一样，文件上传下载功能的使用非常简单，但不推荐在生产环境中使用。因为目前仅支持在单台服务器上使用数据库功能，如果多台机器的服务就有问题了。

如果需要在线上使用上传下载功能，你可以使用proxy的方式pipe到后端接口，或者通过上传组件直接将文件上传到后端的接口。

#### 1、文件上传

方法：

```javascript
this.upload([opt])
```

示例：
```javascript
exports.aj_upload = async function() {
  await this.bindDefault();

  let files = await this.upload();
  let res = {};

  if (!files || files.length < 1) {
    res.code = 1;
    res.message = '上传文件失败！';
    return this.body = res; 
  }

  res.code = 0;
  res.message = '';
  res.data = {
    files: files
  }

  return this.body = res;
}
```

#### 2、文件下载

方法：

```javascript
this.download(filename, [opt])
```

示例：
```javascript
exports.download = async function() {
  await this.download(this.query.file);
}
```

### 其他

Gracejs中几个核心的中间件都介绍完毕。此外，还有几个中间件不做详细介绍，了解即可：

1. **gzip实现**：使用gzip压缩response中的body；
2. **http body内容解析**：解析request中的body，存到`this.request.body`字段中；
3. **简单的session实现**：通过内存或者redis保存session，不推荐在生产环境中使用；生产环境的session服务由后端自行完成。

最后，关于Gracejs的运维部署在这里不再详述，推荐使用[pm2](https://github.com/Unitech/pm2)，**不用担心重启server期间服务不可用**。

## 五、前端构建

到这里，整个前后端服务的搭建都介绍完了。

在介绍如何结合Gracejs进行前端构建之前，先提一下：这种“更彻底”的前后端分离方案相比于基于MVVM框架的单页面应用具体有什么不同呢？

个人认为有以下几点：

1. **运维部署更灵活**
  基于Nodejs server的服务端构建，服务器的部署可以与后端机器独立出来。而且后端同学就仅仅需要关注接口的实现。
2. **前端技术栈更统一**
  比如：PHP部署页面路由，前端通过MVVM框架实现，前端还需要学习PHP语法来实现后端路由。
3. **前端架构和选型更便捷**
  比如你可以很容易通过模板引擎完成BigPipe的架构，你也可以从内网异步并发获取首屏数据。

当然Gracejs是只是服务端框架，前端架构如何选型，随你所愿。

### Boilerplate

目前已经有基于Vue和requirejs的boilerplate。

* [gulp-requirejs-boilerplate](https://github.com/xiongwilee/gulp-requirejs-boilerplate) [![gulp-requirejs-boilerplate](https://img.shields.io/github/stars/xiongwilee/gulp-requirejs-boilerplate.svg?label=%E2%98%85)](https://github.com/xiongwilee/gulp-requirejs-boilerplate)  **Requirejs supported.**（by [@xiongwilee](https://github.com/xiongwilee)）

* [grace-vue-webpack-boilerplate](https://github.com/Thunf/grace-vue-webpack-boilerplate) [![grace-vue-webpack-boilerplate](https://img.shields.io/github/stars/Thunf/grace-vue-webpack-boilerplate.svg?label=%E2%98%85)](https://github.com/Thunf/grace-vue-webpack-boilerplate)  **Both Vue@1.x & Vue@2.x supported.**（by [@thunf](https://github.com/Thunf)）

* [grace-vue2-webpack-boilerplate](https://github.com/haoranw/grace-vue2-webpack-boilerplate) [![grace-vue2-webpack-boilerplate](https://img.shields.io/github/stars/haoranw/grace-vue2-webpack-boilerplate.svg?label=%E2%98%85)](https://github.com/haoranw/grace-vue2-webpack-boilerplate)  Vue@2.x supported.（by [@haoranw](https://github.com/haoranw)）

这里以基于Vue的构建为例。 

### 目录结构

一个完整的依赖基于vue+Gracejs的目录结构推荐使用这种模式：

```shell
.
├── app
│   └── demo
│         ├── build
│         ├── controller
│         ├── mock
│         ├── static
│         ├── views
│         └── vues
└── server
    ├── app
    │    └── demo
    ├── middleware
    ├── ...
```

当然，server（即：Gracejs）允许你配置app目录路径，你可以放到任意你想要的目录里。

这里的demo模块比默认的server下的demo模块多出来两个目录：`build`和`vues`。

### 构建思路

其实，到这里也能猜到如何进行构建了：`build`目录是基于webpack的编译脚本，`vues`目录是所有的.vue的前端业务文件。

webpack将vues下的vue文件编译之后产出到`server/app/demo/static`下；其他`controller`等没有必要编译的文件，直接使用webpack的复制插件复制到`server/app/demo/`的对应目录下即可。

有兴趣的同学，推荐看`grace-vue-webpack-boilerplate`下的build实现源码；当然，需要对webpack和vue有一定的了解。

欢迎同学们贡献基于`React`、`Angular`的boilerplate，以邮件或者ISSUE的形式通知我们之后，添加到Gracejs的官方文档中。

## 结语

自此，洋洋洒洒1w多字，Gracejs终于介绍完毕；有兴趣的同学去github赏个star呗：https://github.com/xiongwilee/koa-grace 。

最后，欢迎大家提issue、fork；有任何疑问也可以邮件联系：xiongwilee[at]foxmail.com。
