exports.index = function* () {
  yield this.bindDefault();

  /**
   * 其实你还可以这么写proxy:
	  yield this.proxy({
	  	repoInfo: 'github:repos/xiongwilee/koa-grace'
	  })
   * 然后在 this.backData.repoInfo 中就可以拿到返回参数
   */

  yield this.render('home', {
    title: 'Hello , Grace!'
  });
}