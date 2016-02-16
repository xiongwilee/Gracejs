(function ($, window) {
	window.editor;

	var init = function(){
		setDefault();
		bindEvent();
	}
	var setDefault = function(){
	}

	var bindEvent = function(){
		$('#userBody').on('click', '.delete', function(evt){
			evt.preventDefault();

			var id = $(this).data('id');

			if(!confirm('您是否确定要删除该用户？')){return;}

			$.post('/dashboard/user/aj_user_delete', {id:id}, function(res){
				if(res.code == 0){
					alert('删除用户成功！');
					window.location.reload();
				}else{
					alert(res.message || '删除用户失败，请稍后再试')
				}
			},'JSON');
		});
		$('#userBody').on('click', '.author-add', function(evt){
			evt.preventDefault();

			var id = $(this).data('id');

			$.post('/dashboard/user/aj_user_author_add', {id:id}, function(res){
				if(res.code == 0){
					alert('设置作者成功！');
					window.location.reload();
				}else{
					alert(res.message || '设置作者失败，请稍后再试')
				}
			},'JSON');
		});
		$('#userBody').on('click', '.author-delete', function(evt){
			evt.preventDefault();

			var id = $(this).data('id');

			$.post('/dashboard/user/aj_user_author_delete', {id:id}, function(res){
				if(res.code == 0){
					alert('删除作者成功！');
					window.location.reload();
				}else{
					alert(res.message || '删除作者失败，请稍后再试')
				}
			},'JSON');
		});
	}

	var _submitData = function(url, method, postData){
		$[method](url, postData, function(res){
			if(res.code == 0){
				alert('提交成功！');
				window.location.reload();
			}else{
				alert(res.message || '提交出错，请稍后再试！');
			}
		},'JSON');
	}

	var _validateData = function(data){
		var result = {};
		$.each(data, function(index, item){
			result[item.name] = item.value;
		});

		console.log(result);

		return result;
	}

	init();
})(jQuery, window)