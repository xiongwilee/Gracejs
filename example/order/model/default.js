module.exports = function () {
	
	console.log(this.path);

	return function (callback){
		setTimeout(function(){
			callback(0,{});
		},1000)
	}
}