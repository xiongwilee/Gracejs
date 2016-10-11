'use strict';

// model名称，即表名
let model = 'Post';

// 表结构
let schema = [{
  title: { type: String, unique: true, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  tips: { type: String, required: false }
}, {
  autoIndex: true,
  versionKey: false
}];

// 静态方法:http://mongoosejs.com/docs/guide.html#statics
let statics = {}

// http://mongoosejs.com/docs/guide.html#methods
let methods = {
  addPost: function*() {
    return this.save();
  },
  listPost: function*() {
    return this.model('Post').find();
  }
}

module.exports.model = model;
module.exports.schema = schema;
module.exports.statics = statics;
module.exports.methods = methods;
