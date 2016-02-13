(function ($, window) {
	window.editor;

	var init = function(){
		setDefault();
		bindEvent();
	}
	var setDefault = function(){
	}

	var bindEvent = function(){
		$('#cateFormAdd').on('submit', function(evt){
			evt.preventDefault();

			var url = $(this).attr('action'),
				method = $(this).attr('method').toLowerCase(),
				data = $(this).serializeArray();
			
			var postData = _validateData(data);

			if(!postData){return;}

			_submitData(url, method, postData);
		});

		$('#cateBody').on('click', '.delete', function(evt){
			evt.preventDefault();

			var id = $(this).data('id');

			$.post('/dashboard/post/aj_cate_delete', {id:id}, function(res){
				if(res.code == 0){
					alert('删除连接成功！');
					window.location.reload();
				}else{
					alert(res.message || '删除链接失败，请稍后再试')
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