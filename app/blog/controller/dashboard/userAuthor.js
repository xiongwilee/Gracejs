'use strict';

// 设置为非路由
exports.__controller__ = false;

function _res(ctx, isJson, message) {
	message = message || '您的权限不够';
	if( isJson ){
		ctx.body = {
			code:403,
			message: message
		}
	}else{
		ctx.redirect('/error/403');
	}

	return false;
}

exports.checkAuth = function(ctx, userInfo, needAdmin, isJson) {
  let message;

  if(!userInfo){
  	message = '您尚未登录，没有权限';
  }

  if(userInfo && !userInfo.isAuthor){
  	message = '您需要作者权限';
  }

  if( needAdmin && userInfo && !userInfo.isAdmin){
  	message = '您需要管理员权限';
  }

  if(message){
  	_res(ctx, isJson, message);
  	return false;
  }else{
  	return true;
  }
}