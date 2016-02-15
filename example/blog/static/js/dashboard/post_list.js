(function ($, window) {
	window.editor;

	var init = function(){
		setDefault();
		bindEvent();
	}
	var setDefault = function(){
	}
	var bindEvent = function(){
		$('#postListBody').on('click','.delete', function(evt){
			evt.preventDefault();
			
			if(!confirm('您是否确定要删除该博客？')){return;}

			var id = $(this).data('id');
			$.post('/dashboard/post/aj_post_delete', {id:id},function(res){
				if( res.code == 0){
					alert('删除成功！');
					window.location.reload();
				}else{
					alert(res.message || '删除失败，请稍后再试！')
				}
			},"JSON")
		});
	}

	init();
})(jQuery, window)