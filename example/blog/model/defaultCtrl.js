module.exports = function* () {
	function getData(){
		return function (callback){
			setTimeout(function(){
				callback(0,{});
			},0)
		}
	}

	yield getData();

	this.body = 'default';
}