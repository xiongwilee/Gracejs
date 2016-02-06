var ctrl = {
  index: function*(next) {
    yield this.bindDefault();
    
    this.body = 'deal/,deal/index,deal/index/index';
  },
  order: function*() {
    this.body = 'deal/index/order';
  }
}

module.exports = ctrl;