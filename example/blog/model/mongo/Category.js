'use strict';

// model名称，即表名
let model = 'Category';

// 表结构
let schema = [{
  id: {type: String,unique: true,required: true},
  name: {type: String,required: true},
  numb: {type: Number}
}, {
  autoIndex: true,
  versionKey: false
}];

// 静态方法:http://mongoosejs.com/docs/guide.html#statics
let statics = {}

// http://mongoosejs.com/docs/guide.html#methods
let methods = {
  add: function* () {
  	return this.save();
  },
  getCategoryById: function* (id) {
  	return this.model('Category').find({id:id});
  },
  list: function* () {
    return this.model('Category').find();
  }
}

module.exports.model = model;
module.exports.schema = schema;
module.exports.statics = statics;
module.exports.methods = methods;