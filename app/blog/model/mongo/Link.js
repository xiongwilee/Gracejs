'use strict';

// model名称，即表名
exports.model = 'Link';

// 表结构
exports.schema = [{
  id: {type: String,unique: true,required: true},
  name: {type: String,required: true},
  href: {type: String,required: true}
}, {
  autoIndex: true,
  versionKey: false
}];

// 静态方法:http://mongoosejs.com/docs/guide.html#statics
exports.statics = {}

// http://mongoosejs.com/docs/guide.html#methods
exports.methods = {
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

    if(is_new == 1){
      return this.save();  
    }else{
      return this.model('Link').update({id:id},getData(this._doc));
    }
  },
  add: function* () {
  	return this.save();
  },
  getLinkById: function* (id) {
  	return this.model('Link').findOne({id:id});
  },
  list: function* () {
    return this.model('Link').find();
  },
  deleteLink : function* (id) {
    let post = yield this.model('Link').findOne({id:id});

    if(post){
      yield this.model('Link').remove({id:id});
    }

    return post;
  }
}