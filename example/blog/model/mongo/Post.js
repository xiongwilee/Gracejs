'use strict';

// model名称，即表名
let model = 'Post';

// 表结构
let schema = [{
  id: {type: String,unique: true,required: true},
  title: {type: String,unique: true,required: true},
  image: {type: String},
  time: {type: Date,'default': Date.now},
  author: {type: String,required: true},
  content: {type: String,required: true},
  htmlContent: {type: String,required: true},
  category: {type: String,required: true},
  tips: {type: Array}
}, {
  autoIndex: true,
  versionKey: false
}];

// 静态方法:http://mongoosejs.com/docs/guide.html#statics
let statics = {}

// http://mongoosejs.com/docs/guide.html#methods
let methods = {
  edit: function*(is_new) {
    let id = this.id;

    if(is_new){
      return this.save();  
    }else{
      return this.update({id:id});
    }
  },
  getPostById: function*(id) {
    return this.model('Post').findOne({id:id});
  },
  count: function*(pageNum, pageSize, query){
    pageNum = pageNum || 1;
    pageSize = pageSize || 10;
    query = query || {};
    let result = {};

    // 数据量
    result.totalNum = yield this.model('Post').count(query);
    // 当前多少页
    result.pageNum = pageNum;
    // 一共多少页
    result.totalPage = Math.ceil( result.totalNum / pageSize );
    // 是否有上一页
    result.hasPrePage = (pageNum - 1 > 0);
    // 是否有下一页
    result.hasNexPage = (pageNum + 1 <= result.totalPage);

    return result;
  },
  page: function*(pageNum, pageSize, query) {
    pageNum = pageNum || 1;
    pageSize = pageSize || 10;
    query = query || {};

    return this.model('Post').find(query).sort({'_id':-1}).skip((pageNum - 1) * pageSize).limit(pageSize);
  }
}

module.exports.model = model;
module.exports.schema = schema;
module.exports.statics = statics;
module.exports.methods = methods;