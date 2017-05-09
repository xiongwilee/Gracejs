'use strict';

// 以下是自动化测试case

exports.case = {
  baidu_url: function*() {
    yield this.proxy('https://www.baidu.com');
  },
  baidu_api_get: function*() {
    yield this.proxy('baidu:/test/test');
  },
  baidu_api_post: function*() {
    yield this.proxy('baidu:post:/test/test');
  }
}


// 以下是人肉测试case

/* 综合测试： 127.0.0.1:3000/test/ */
exports.index = function*() {
    let url = 'http://' + this.request.header.host;

    this.cookies.set('test', 'test');
    // 代理数据
    let res = yield this.proxy({
      data1: url + '/test/data_1',
      data2: url + '/test/data_2',
      data3: 'http://test'
    });

    this.body = `
<script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js" ></script>
<body><pre>${JSON.stringify(this.backData,null,'  ')}</pre></body>'
<script>
$.ajax({
      url: '/test/data_aj_post',
      data: '{"test4":"test4"}',
      method: 'post',
      contentType: 'application/json',
      success: function(data) {
        console.log(data);
      }
  });

$.post('/test/data_aj_post',{test:'test',test1:'test1'},function(data) {
  console.log(data);
});

$.get('/test/data_aj_post',{test:'test',test1:'test1'},function(data) {
  console.log(data);
});

$.get('/test/data_timeout',function(data) {
  console.log(data);
});
</script>
`
  }
  /*** 综合测试： 127.0.0.1:3000/test/ ***/



/* 上传测试： 127.0.0.1:3000/test/form */
exports.upload = function*() {
  yield this.upload();
  this.body = { code: 0 }
}

exports.form_upload = function*() {
  yield this.proxy('local:test/upload');
}

exports.form = function*() {
    this.body = '' +
      '<form action="/test/form_upload" enctype="multipart/form-data" method="post">' +
      '<input type="text" name="title"><br>' +
      '<input type="file" name="upload1" multiple="multiple"><br>' +
      '<input type="file" name="upload2" multiple="multiple"><br>' +
      '<input type="submit" value="Upload">' +
      '</form>';
  }
  /*** 上传测试： 127.0.0.1:3000/test/form ***/



/* 设置cookie测试： 127.0.0.1:3000/test/single */
exports.single = function*() {
    yield this.proxy('local:test/data_1')
  }
  /*** 设置cookie测试： 127.0.0.1:3000/test/single ***/



/* proxy重定向测试测试： 127.0.0.1:3000/test/redirect_test */
exports.redirect_test = function*() {
  yield this.proxy('local:test/redirect')
}

exports.redirect = function*() {
    this.redirect('/test/data_1')
  }
  /*** proxy重定向测试测试： 127.0.0.1:3000/test/redirect_test ***/



/* fetch模式设置cookie测试： 127.0.0.1:3000/test/fetch */
exports.fetch = function*() {
    let url = 'http://' + this.request.header.host;

    yield this.fetch(url + '/test/data_1');
  }
  /*** fetch模式设置cookie测试： 127.0.0.1:3000/test/fetch ***/



/* fetch图片： 127.0.0.1:3000/test/fetch_img */
exports.fetch_img = function*() {
    yield this.fetch('https://www.baidu.com/img/bd_logo1.png');
  }
  /*** fetch图片： 127.0.0.1:3000/test/fetch_img ***/



/* proxy超时时间测试： 127.0.0.1:3000/test/data_timeout */
exports.timeout = function*() {
  function getData() {
    return function(callback) {
      setTimeout(function() {

        callback(0, {
          message: 'this is a timeout test!'
        });
      }, 16000)
    }
  }

  var data = yield getData();

  this.body = data;
}
exports.data_timeout = function*() {
    let url = 'http://' + this.request.header.host;
    yield this.proxy(url + '/test/timeout', {
      conf: {
        timeout: 20000
      }
    })
  }
  /*** proxy超时时间测试： 127.0.0.1:3000/test/data_timeout ***/



/* 重试机制测试： 127.0.0.1:3000/test/retry */
exports.retry = function*() {
  yield this.proxy({
    'retry_1': 'local:test/proxy_retry_1',
    'retry_2': 'local:test/proxy_retry_2'
  })
  this.body = {
    'retry_1': this.backData.retry_1,
    'retry_2': this.backData.retry_2
  }
}

exports.proxy_retry_1 = function*() {
  this.res.statusCode = 200;
  if (Math.random() < 0.5) {
    this.body = '';
  } else {
    this.body = '11111';
  }
}

exports.proxy_retry_2 = function*() {
    this.res.statusCode = 200;
    if (Math.random() < 0.5) {
      this.body = '';
    } else {
      this.body = '22222';
    }
  }
  /*** 重试机制测试： 127.0.0.1:3000/test/retry ***/

exports.data_1 = function*() {
  this.body = {
    user_id: '111111',
    cookie: this.cookies.get('test')
  }
  this.cookies.set('test1', 'test1');
  this.cookies.set('test2', 'test2');

}

exports.data_2 = function*() {
  this.body = {
    user_id: '222222'
  }
  this.cookies.set('test2', 'test2')

}

exports.data_post = function*() {
  this.body = {
    user_id: '444444',
    body: this.request.body || '没有post参数'
  };

  this.cookies.set('cookie_test4_1', 'test4_1');
  this.cookies.set('cookie_test4_2', 'test4_2');
}

exports.data_aj_post = function*() {
  yield this.proxy({
    local: 'local:post:test/data_post',
    test: 'test:post:auth/send_sms_code'
  })
  this.body = this.backData;
}
