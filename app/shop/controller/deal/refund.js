exports.index = function* () {
    this.body = 'deal/refund/,deal/refund/index';
}
exports.detail = function* () {
	console.log(this.request,this.request.query,this.params);
    this.body = 'deal/refund/detail';
}
exports.list = function* () {
    this.body = 'deal/refund/list';
}