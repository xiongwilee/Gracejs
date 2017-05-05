'use strict';

const http = require('http');
const querystring = require('querystring');
const url_opera = require('url');
const request = require('./lib/request');
const raven = require('raven');
const error = require('debug')('koa-grace-error:proxy');

/**
 * 
 * @param  {string} app     context
 * @param  {object} api     api配置项
 * @param  {object} config  proxy 补充配置项
 * @param  {object} options request配置项
 * 
 * @return {function}
 * 
 * @todo this.proxy返回http statusCode 
 * @todo 提供看有哪些接口的快捷方式
 */
module.exports = function proxy(app, api, config, options) {

  api = api || {};
  config = config || {};
  options = options || {};

  let ravenClient;
  if (options.dsn) {
    ravenClient = new raven.Client(options.dsn);
    delete options.dsn;
  }

  return async function(ctx, next) {
    if (ctx.proxy) return await next();

    let req = ctx.req;
    let res = ctx.res;

    // 如果配置了allowShowApi而且页面的URL以__data__结尾则命中debug模式
    let isDebug = config.allowShowApi && /__data__$/.test(ctx.req.url);

    /**
     * proxy
     * @param {object} opt 需要并发请求的url，例如:{user1: 'local:/data/1',user2: 'local:/data/2'}
     */
    Object.assign(ctx, {
      proxy: function(opt, config) {
        config = config || {}

        // 装载proxy结果的容器
        let destObj = config.dest;
        if (!destObj) {
          destObj = ctx.backData = (ctx.backData || {})
        }

        // 抽离opt为string的情况：
        // 如果当前语法为：this.proxy('test:test/test')， 
        // 则直接将返回内容注入到this.body
        if (typeof opt === 'string') {
          destObj = ctx;
          opt = { 'body': opt };
        }

        // 装载头信息的容器
        let headerContainer = config.headerContainer;

        let reqsParam = Object.keys(opt);
        let proxyProto = '__proxyname__';
        
        let reqs = reqsParam.map((proxyName) => {
          // 分析当前proxy请求的URL
          let realReq = setRequest(ctx, opt[proxyName]);

          // 扩展请求头信息
          let headersObj = Object.assign({}, realReq.headers, config.headers)

          // 请求request的最终配置
          let requestOpt = Object.assign({}, options, {
            uri: realReq.uri,
            method: realReq.method,
            headers: headersObj
          }, config.conf);

          return request(ctx, {
            needPipeRes: false,
            data: config.form || formatBody(ctx.request.body)
          }, requestOpt, (response, data) => {
            response && (response[proxyProto] = proxyName);

            // 将获取到的数据注入到上下文的destObj参数中
            destObj[proxyName] = data;
            // 将获取到的头信息注入到配置的参数中
            headerContainer && (headerContainer[proxyName] = response.headers);
            // 设置cookie
            response && setResCookies(ctx, response.headers)
              // 获取后端api配置
            isDebug && setApiOpt(ctx, realReq.uri, data, response && response.headers);

            return response;
          })
        })

        // 并发异步数据请求
        return new Promise((resolve) => {
          Promise.all(reqs).then((data) => {
            let result = {}
            data.forEach((response) => {
              if (!response) return;
              let proxyName = response[proxyProto];
              result[proxyName] = response
            })
            resolve(result)
          });
        })
      },
      /**
       * 从其他server通过http的方式拉取资源
       * @param {String} url           请求url
       * @yield {Object} 返回数据 
       */
      fetch: function(url, config) {
        config = config || {}

        // 获取头信息
        let realReq = setRequest(ctx, url);

        // 扩展请求头信息
        let headersObj = Object.assign({}, realReq.headers, config.headers)
        
        // 请求request的最终配置
        let requestOpt = Object.assign({}, options, {
          uri: realReq.uri,
          method: realReq.method,
          headers: headersObj,
          timeout: undefined,
          gzip: false,
          encoding: null
        }, config.conf);

        return request(ctx, {
          needPipeRes: true,
          data: config.form || formatBody(ctx.request.body)
        }, requestOpt);
      }
    });

    await next();

    // debug模式下，返回后端api数据
    if (isDebug && ctx.__back__) {
      ctx.body = ctx.__back__
    }
  };

  /**
   * 格式化body：如果body为空对象则直接返回false，用以填一个request的坑，
   * @param  {Object} body body对象
   * @return {Object|Boolean} 
   */
  function formatBody(body) {
    for (let key in body) {
      if (body.hasOwnProperty(key)) return body;
    }

    return false;
  }

  /**
   * 根据分析proxy url的结果和当前的req来分析最终的url/method/头信息
   * @param {Object} ctx koa上下文
   * @param {Object} path 请求路径
   */
  function setRequest(ctx, path) {
    let headers = ctx.headers || {};
    let query = ctx.query;

    // 获取实际要请求的method和url:
    //  首先通过analyUrl方法将 github:post:/test/test 转换成真正的URL，
    //  然后通过addQuery方法将 当前页面中的query 添加到URL中
    //  最后通过getUri方法 分析URL 的真实URI和HOST
    let urlObj = analyUrl(ctx, path);
    let url = addQuery(urlObj.url, query);
    let uriObj = getUri(url);

    // 复制一份头信息
    let result = Object.assign({}, headers);

    // 配置host，先把当前用户host存入user-host,然后把请求host赋值给headers
    result['user-host'] = result.host;
    result.host = uriObj.host;

    // 由于字段参数发生改变，content-length不再可信删除content-length字段
    delete result['content-length'];

    // 干掉请求中的if-modified-since字段，以防命中服务端缓存，返回304
    delete result['if-modified-since'];

    // 如果用户请求为POST，但proxy为GET，则删除头信息中不必要的字段
    if (ctx.method == 'POST' && urlObj.method == 'GET') {
      delete result['content-type'];
    }

    return {
      method: urlObj.method,
      uri: uriObj.uri,
      headers: result
    }
  }

  /**
   * 分析当前proxy请求url，
   * @param  {url} path 请求url，例如：'github:user/info'
   * @return {Object}      返回真正的url和方法
   */
  function analyUrl(ctx, path) {
    // 如果是标准的url，则以http或者https开头
    // 则直接发送请求不做处理
    let isUrl = /^(http:\/\/|https:\/\/)/;
    if (isUrl.test(path)) {
      return {
        url: path,
        method: ctx.method
      }
    }

    // 否则，用"?"切分URL："?"前部用以解析真实的URL
    let urlQueryArr = path.split('?');
    let urlPrefix = urlQueryArr[0] || '';

    // url前部只能包含1个或2个":"，否则报错
    let urlReg = urlPrefix.split(':');
    if (urlReg.length < 2 || urlReg.length > 3) {
      throw `Illegal proxy path：${path} !`;
    }

    // nodejs v4版本还不支持解构赋值，先这么写
    let urlOrigin = api[urlReg[0]];
    let urlMethod = urlReg[1];
    let urlPath = urlReg[2];

    if (!urlPath) {
      urlPath = urlMethod;
      urlMethod = ctx.method;
    }
    
    // 如果在api配置中查找不到对应的api则报错
    if (!urlOrigin) {
      throw `Undefined proxy url：${path} , please check your api config!`
    }

    // 拼接URL
    let urlHref = url_opera.resolve(urlOrigin, urlPath)
    return {
      url: path.replace(urlPrefix, urlHref),
      method: urlMethod.toUpperCase()
    }
  }

  /**
   * 合并参数
   * @param  {String} url   URL
   * @param  {Object} query 当前请求的query
   * @return {String}       返回URL      
   */
  function addQuery(url, query) {
    let urlObj = url_opera.parse(url);
    let urlQue = querystring.parse(urlObj.query);
    query = query || {};
    // 把页面url中的请求参数和数据连接中的请求参数合并
    urlQue = Object.assign({}, query, urlQue);

    // 把合并之后参数进行stringify，作为新的参数
    let queStr = querystring.stringify(urlQue);
    let urlStr = urlObj.protocol + '//' + urlObj.host + urlObj.pathname;

    urlStr += queStr ? ('?' + queStr) : '';

    return urlStr;
  }

  /**
   ********** TODO: 可以优化 *********
   * 设置response cookie
   * @param {object} res     response
   * @param {object} headers 头信息
   */
  function setResCookies(ctx, headers) {
    if (!headers || !validateCookies(headers['set-cookie'])) {
      return
    }

    let cookies = headers['set-cookie'];

    ctx.res._headers = ctx.res._headers || {};
    ctx.res._headerNames = ctx.res._headerNames || {};

    // 以下set-cookie的方案参见nodejs源码：https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js#L353-L359
    // 设置头字段中set-cookie为对应cookie
    ctx.res._headers['set-cookie'] = ctx.res._headers['set-cookie'] || [];
    ctx.res._headers['set-cookie'] = ctx.res._headers['set-cookie'].concat(cookies);

    // 设置头字段set-cookie的名称为set-cookie
    ctx.res._headerNames['set-cookie'] = 'set-cookie';
  }

  /**
   * 检查cookie的合法性
   * @param  {Array} cookies  cookies字段数组
   * @return {Boolean}        是否合法
   */
  function validateCookies(cookies) {
    if (!cookies || !cookies.length || 0 >= cookies.length) {
      return false
    }

    if (!cookies[0]) {
      return false
    }

    return true
  }

  /**
   * 保存后端api配置信息
   * @param  {Object} ctx  koa 上下文
   * @param  {String} url  api URL
   * @param  {Object} data api 数据
   * @param  {Object} headers 返回头信息
   * @return {}
   */
  function setApiOpt(ctx, url, data, headers) {
    // 保存后端api配置
    ctx.__back__ = ctx.__back__ || {};

    ctx.__back__[url] = {
      url: url,
      data: data,
      headers: headers
    }

    return
  }

  /**
   * 根据当前host配置，生成正确的URL
   * @param  {url} url    当前请求的URL
   * @return {Object}     返回请求的正确URL及uri
   */
  function getUri(url) {
    let uriObj = url_opera.parse(url);

    let uri = url;
    let host = uriObj.hostname;

    // 如果有hosts的配置，且有对应域名的IP，则更改uri中的域名为IP
    if (config.hosts && config.hosts[host]) {
      let protocol = uriObj.protocol + '//';
      let ip = config.hosts[host];

      uri = url.replace(protocol + uriObj.host, protocol + ip);
    }

    return {
      uri: uri,
      host: host
    }
  }
}
