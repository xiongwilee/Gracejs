(function ($) {
	var init = function(){
		bindEvent();
	}
	var bindEvent = function(){
		hljs.initHighlightingOnLoad();
	}

	init();
})(window.jQuery)