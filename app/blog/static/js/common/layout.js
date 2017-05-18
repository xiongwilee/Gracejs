(function($) {
  var $html = $('html');

  var init = function() {
    setDefault();
    bindEvent();
  }
  var bindEvent = function() {
    $('#search_form_wd').on('keyup', function(evt) {
      var thisVal = $(this).val();
      $('#search_form_wd_hidden').val(thisVal + ' site:feclub.cn');
    });

    $('#content_post').on('click', '.post-link', function(evt) {
      console.log(this);
    })
  }
  var setDefault = function() {
    _setTheme();
  }
  var _setTheme = function() {
    var theme = [
        'theme-3','theme-4','theme-5','theme-6','theme-7','theme-8'
      ].sort(function() {
        return Math.random() - 0.5;
      }).slice(0, 1);

    $html.addClass(theme[0]);
  }

  init();
})(window.jQuery)