module.exports = function* () {
	function getData(){
		return function (callback){
			setTimeout(function(){
				callback(0,{});
			},3000)
		}
	}
console.log(11111);
	yield getData();
console.log(22222);
	this.body = 'default';

	// this.res.end();
}