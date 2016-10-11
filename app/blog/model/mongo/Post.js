'use strict';

// model名称，即表名
exports.model = 'Post';

// 表结构
exports.schema = [{
  id: {type: String,unique: true,required: true},
  title: {type: String,required: true},
  image: {type: String},
  from: {type: String},
  time: {type: Date,'default': Date.now},
  updateTime: {type: Date,'default': Date.now},
  author: {type: String,required: true},
  content: {type: String,required: true},
  htmlContent: {type: String,required: true},
  introContent: {type: String,required: true},
  category: {type: String,required: true},
  tag: {type: Array}
}, {
  autoIndex: true,
  versionKey: false
}];

// 静态方法:http://mongoosejs.com/docs/guide.html#statics
exports.statics = {}

// http://mongoosejs.com/docs/guide.html#methods
exports.methods = {
  list: function* () {
    return this.model('Post').find();
  },
  edit: function*(is_new) {
    let id = this.id;

    function getData(data){
      let result = {};
      for(let item in data){
        if( data.hasOwnProperty(item) && item !== '_id'){
          result[item] = data[item];
        }
      }
      return result;
    }

    // 更新文档更新时间
    this._doc.updateTime = Date.now();

    if(is_new == 1){
      return this.save();  
    }else{
      return this.model('Post').update({id:id},getData(this._doc));
    }
  },
  deletePost : function* (id) {
    let post = yield this.model('Post').findOne({id:id});

    if(post){
      yield this.model('Post').remove({id:id});
    }

    return post;
  },
  getPostById: function* (id) {
    return this.model('Post').findOne({id:id});
  },
  count: function*(pageNum, pageSize, query){
    pageNum = pageNum*1 || 1;
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