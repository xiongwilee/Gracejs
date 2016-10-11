exports.index = function* () {
    this.body = this.request.url;
}
exports.order = function* () {
    this.body = this.request.url;
}