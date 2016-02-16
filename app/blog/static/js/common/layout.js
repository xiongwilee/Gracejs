(function ($) {
	var init = function(){
		bindEvent();
	}
	var bindEvent = function(){	
		$('#search_form_wd').on('keyup', function(evt){
			var thisVal = $(this).val();
			$('#search_form_wd_hidden').val(thisVal + ' site:mlsfe.biz');
		});

		$('#content_post').on('click','.post-link', function(evt){
			console.log(this);
		})
	}

	init();
})(window.jQuery)