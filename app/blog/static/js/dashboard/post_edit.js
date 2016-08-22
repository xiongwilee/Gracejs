(function($, window) {
  window.editor;

  var init = function() {
    setDefault();
    bindEvent();
  }
  var setDefault = function() {
    _setEditor();
  }
  var bindEvent = function() {
    $('#contentForm').on('submit', function(evt) {
      evt.preventDefault();

      var url = $(this).attr('action'),
        method = $(this).attr('method').toLowerCase(),
        data = $(this).serializeArray();

      var postData = _validateData(data);

      if (!postData) {
        return; }

      _submitData(url, method, postData);
    })
  }

  var _submitData = function(url, method, postData) {
    $[method](url, postData, function(res) {
      if (res.code == 0) {
        alert('提交成功！');
        window.location.href = '/dashboard/post/list'
      } else {
        alert(res.message || '提交出错，请稍后再试！');
      }
    }, 'JSON');
  }

  var _validateData = function(data) {
    var result = {};
    $.each(data, function(index, item) {
      result[item.name] = item.value;
    });

    result.content = editor.value();

    result.htmlContent = editor.markdown(result.content);

    result.introContent = _getIntroContent(result.htmlContent);

    console.log(result);

    return result;
  }

  var _getIntroContent = function(html) {
    var htmlContent = $(html),
      result = '';
    for (var i = 0; i < 10; i++) {
      if (!htmlContent[i]) {
        break;
      }
      if (!htmlContent[i].outerHTML) {
        continue;
      }

      result += htmlContent[i].outerHTML;
    }
    return result
  }

  var _setEditor = function() {
    editor = new SimpleMDE({
      element: document.getElementById("inputContent")
    });
  }

  init();
})(jQuery, window)
