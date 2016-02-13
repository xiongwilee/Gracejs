'use strict';

// model名称，即表名
let model = 'User';

// 表结构
let schema = [{
  id: {type: String,unique: true,required: true},
  name: {type: String,required: true},
  isAuthor: {type: Boolean,'default':true},
  isAdmin: {type: Boolean,'default':false},
  nickname: {type: String,required: true},
  avatar: {type: String,required: true},
  github: {type: String,required: true},
  email: {type: String,required: true},
  blog: {type: String}
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
  getUserById: function* (id) {
  	return this.model('User').findOne({id:id});
  },
  getAuthor: function* (){
    return this.model('User').find({isAuthor:true});
  },
  list: function* () {
    return this.model('User').find();
  }
}

module.exports.model = model;
module.exports.schema = schema;
module.exports.statics = statics;
module.exports.methods = methods;