(function($) {
  var $header = $('#header');

  var init = function() {
    setDefault();
    bindEvent();
  }
  var bindEvent = function() {
    $('#search_form_wd').on('keyup', function(evt) {
      var thisVal = $(this).val();
      $('#search_form_wd_hidden').val(thisVal + ' site:mlsfe.biz');
    });

    $('#content_post').on('click', '.post-link', function(evt) {
      console.log(this);
    })
  }
  var setDefault = function() {
    _setTheme();
  }
  var _setTheme = function() {
    var theme = ['/static/image/bg_3_s.jpg',
      '/static/image/bg_4_s.jpg',
      '/static/image/bg_5_s.jpg',
      '/static/image/bg_6_s.jpg',
      '/static/image/bg_7_s.jpg',
      '/static/image/bg_8_s.jpg'
    ].sort(function() {
      return Math.random() - 0.5;
    }).slice(0, 1);

    $header.css('background-image','url('+theme+')');
  }

  init();
})(window.jQuery)