exports.index = function* () {
  yield this.render('home', {
    title: 'Hello Koa-hornbill & reactjs-boilerpalte!'
  });
}