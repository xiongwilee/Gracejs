'use strict';

// model名称，即表名
exports.model = 'Category';

// 表结构
exports.schema = [{
  id: {type: String,unique: true,required: true},
  name: {type: String,required: true},
  numb: {type: Number,'default':0}
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
      return this.model('Category').update({id:id},getData(this._doc));
    }
  },
  getCategoryById: function* (id) {
    return this.model('Category').findOne({id:id});
  },
  /**
   * 更新分类数量
   * @param {String} id            分类ID，TODO:不传id为更新所有分类数量
   */
  updateCateNum: function* (id) {
    let count = yield this.model('Post').count({
      category:id
    });

    return this.model('Category').update({id:id},{
      numb : count
    });
  },
  numbAdd: function* (id, addNum) {
    let cate = yield this.model('Category').findOne({id:id});
    let num = cate.numb || 0;
    let add = addNum || 1;

    return this.model('Category').update({id:id},{
      numb : num + add
    });
  },
  numbMinus: function* (id, minus) {
    let cate = yield this.model('Category').findOne({id:id});
    let num = cate.numb || 0;
    let min = minus || 1;

    return this.model('Category').update({id:id},{
      numb : num - min
    });
  },
  list: function* () {
    return this.model('Category').find();
  },
  deleteCate : function* (id) {
    let cate = yield this.model('Category').findOne({id:id});

    if(cate && cate.numb < 1){
      yield this.model('Category').remove({id:id});
    }

    return cate;
  }
}