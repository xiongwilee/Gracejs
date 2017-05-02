requirejs.config({
  baseUrl: '/',
  shim: {
  },
  map: {
    '*': {}
  },
  paths: {
    'zepto': 'iblog/static/js/lib/zepto.min',
    'reveal': 'iblog/static/js/lib/reveal/reveal',
    'head': 'iblog/static/js/lib/reveal/head.min',
    'marked': 'iblog/static/js/lib/reveal/marked',
    'highlight': 'iblog/static/js/lib/reveal/highlight.min',
    'simplemde': 'iblog/static/js/lib/simplemde.min',
    'postdetail': 'iblog/static/js/common/post-detail',
    'postslider': 'iblog/static/js/common/post-slider'
  }
});
