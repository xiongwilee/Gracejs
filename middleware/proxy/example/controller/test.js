'use strict';

// 以下是自动化测试case

exports.case = {
  baidu_url: async function() {
    await this.proxy('https://www.baidu.com');
  },
  baidu_api_get: async function() {
    await this.proxy('baidu:/test/test');
  },
  baidu_api_post: async function() {
    await this.proxy('baidu:post:/test/test');
  }
};


// 以下是人肉测试case

/* 综合测试： 127.0.0.1:3000/test/ */
exports.index = async function() {
  let url = 'http://' + this.request.header.host;

  this.cookies.set('test', 'test');
  // 代理数据
  let res = await this.proxy({
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
`;
};
/*** 综合测试： 127.0.0.1:3000/test/ ***/



/* 上传测试： 127.0.0.1:3000/test/form */
exports.upload = async function() {
  await this.upload();
  this.body = { code: 0 };
};

exports.form_upload = async function() {
  await this.proxy('local:test/upload');
};

exports.form = async function() {
  this.body = '' +
      '<form action="/test/form_upload" enctype="multipart/form-data" method="post">' +
      '<input type="text" name="title"><br>' +
      '<input type="file" name="upload1" multiple="multiple"><br>' +
      '<input type="file" name="upload2" multiple="multiple"><br>' +
      '<input type="submit" value="Upload">' +
      '</form>';
};
/*** 上传测试： 127.0.0.1:3000/test/form ***/



/* 设置cookie测试： 127.0.0.1:3000/test/single */
exports.single = async function() {
  await this.proxy('local:test/data_1');
};
/*** 设置cookie测试： 127.0.0.1:3000/test/single ***/



/* proxy重定向测试测试： 127.0.0.1:3000/test/redirect_test */
exports.redirect_test = async function() {
  await this.proxy('local:test/redirect');
};

exports.redirect = async function() {
  this.redirect('/test/data_1');
};
/*** proxy重定向测试测试： 127.0.0.1:3000/test/redirect_test ***/



/* fetch模式设置cookie测试： 127.0.0.1:3000/test/fetch */
exports.fetch = async function() {
  let url = 'http://' + this.request.header.host;

  await this.fetch(url + '/test/data_1');
};
/*** fetch模式设置cookie测试： 127.0.0.1:3000/test/fetch ***/



/* fetch图片： 127.0.0.1:3000/test/fetch_img */
exports.fetch_img = async function() {
  await this.fetch('https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', {
    onBeforeRequest: (requestOpt, proxyName) => {
      console.log(requestOpt);
    }
  });
  this.set('content-type','image/png');
};
/*** fetch图片： 127.0.0.1:3000/test/fetch_img ***/


/* fetch图片： 127.0.0.1:3000/test/fetch_mp3 */
exports.fetch_mp3 = async function() {
  await this.fetch('http://ccapi.qudian.com/v2/wintelapi/api/record/playrecord?vcc_code=qiche&call_id=6412117045625753600');
};
/*** fetch图片： 127.0.0.1:3000/test/fetch_mp3 ***/



/* proxy超时时间测试： 127.0.0.1:3000/test/data_timeout */
exports.timeout = async function() {
  function getData() {
    return function(callback) {
      setTimeout(function() {

        callback(0, {
          message: 'this is a timeout test!'
        });
      }, 16000);
    };
  }

  var data = await getData();

  this.body = data;
};
exports.data_timeout = async function() {
  let url = 'http://' + this.request.header.host;
  await this.proxy(url + '/test/timeout', {
    conf: {
      timeout: 20000
    }
  });
};
/*** proxy超时时间测试： 127.0.0.1:3000/test/data_timeout ***/



/* 重试机制测试： 127.0.0.1:3000/test/retry */
exports.retry = async function() {
  await this.proxy({
    'retry_1': 'local:test/proxy_retry_1',
    'retry_2': 'local:test/proxy_retry_2'
  });
  this.body = {
    'retry_1': this.backData.retry_1,
    'retry_2': this.backData.retry_2
  };
};

exports.proxy_retry_1 = async function() {
  this.res.statusCode = 200;
  if (Math.random() < 0.5) {
    this.body = '';
  } else {
    this.body = '11111';
  }
};

exports.proxy_retry_2 = async function() {
  this.res.statusCode = 200;
  if (Math.random() < 0.5) {
    this.body = '';
  } else {
    this.body = '22222';
  }
};
/*** 重试机制测试： 127.0.0.1:3000/test/retry ***/

exports.proxy_obj = async function() {
  let res = await this.proxy({
    'test': {
      uri: 'https://www.baidu.com'
    },
    'test1': {
      uri: 'local:post:test/data_post',
      form: {
        test1:'test1'
      }
    }
  });

  this.body = res;
};

exports.data_1 = async function() {
  this.body = {
    user_id: '111111',
    cookie: this.cookies.get('test')
  };
  this.cookies.set('test1', 'test1');
  this.cookies.set('test2', 'test2');

};

exports.data_2 = async function() {
  this.body = {
    user_id: '222222'
  };
  this.cookies.set('test2', 'test2');

};

exports.data_post = async function() {
  this.body = {
    user_id: '444444',
    body: this.request.body || '没有post参数'
  };

  this.cookies.set('cookie_test4_1', 'test4_1');
  this.cookies.set('cookie_test4_2', 'test4_2');
};

exports.data_aj_post = async function() {
  await this.proxy({
    local: 'local:post:test/data_post',
    test: 'test:post:auth/send_sms_code'
  });
  this.body = this.backData;
};
