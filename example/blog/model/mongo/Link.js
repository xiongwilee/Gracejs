'use strict';

// model名称，即表名
let model = 'Link';

// 表结构
let schema = [{
  id: {type: String,unique: true,required: true},
  name: {type: String,required: true},
  href: {type: String,required: true}
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
  getLinkById: function* (id) {
  	return this.model('Link').find({id:id});
  },
  list: function* () {
    return this.model('Link').find();
  }
}

module.exports.model = model;
module.exports.schema = schema;
module.exports.statics = statics;
module.exports.methods = methods;