var defaultCtrl = require('../../model/default');

var ctrl = {
	index : function* (next) {
		yield defaultCtrl.bind(this)();

		this.body = 'test';

console.log(next,'~~~~~~~~');

		yield next;

		return;
		
	    this.body = 'deal/,deal/index,deal/index/index';
	},
	order : function* () {
	    this.body = 'deal/index/order';
	}
}

module.exports = ctrl;