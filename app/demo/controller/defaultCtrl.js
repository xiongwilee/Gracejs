module.exports = async function () {
	console.log('this is a base controller!')
}

// 设置为非路由
module.exports.__controller__ = false;