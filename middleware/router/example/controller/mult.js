exports.test1 = {
  aj_1: function() {
    this.body = this.request.url;
  },
  aj_2: {
    aj_2_1: function() {
      this.body = this.request.url;
    },
    aj_2_2: function() {
      this.body = this.request.url;
    }
  },
  aj_3: {
    aj_3_1: {
      // 该路由层级超过三级，生成路由失败
      aj_3_1_1: function() {
        this.body = this.request.url;
      }
    }
  }
}

exports.test2 = function*() {
  this.body = this.request.url;
}
exports.test3 = function*() {
  this.body = this.request.url;
}
exports.index = function*() {
  this.body = this.request.url;
}
