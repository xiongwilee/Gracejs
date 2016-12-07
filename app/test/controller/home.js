'use strict';
exports.index = function* () {
	this.body = 'hello /test/home!'
	// 或：
	// /test/home/index
}
exports.home_1 = function* () {
	this.body = 'hello /test/home/home_1!'
}