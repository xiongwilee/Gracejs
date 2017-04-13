define(['zepto', 'reveal', 'head', 'marked'],
  function($, Reveal, head, marked) {

    function postSlider() {
      this.init()
    }

    postSlider.prototype = {
      init: function() {
        Reveal.initialize({
          controls: true,
          progress: true,
          history: true,
          center: true,

          theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
          transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

          // Parallax scrolling
          // parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
          // parallaxBackgroundSize: '2100px 900px',

          // Optional libraries used to extend on reveal.js
          dependencies: [{
            src: '/iblog/static/js/lib/reveal/classList.min.js',
            condition: function() {
              return !document.body.classList;
            }
          }, {
            src: '/iblog/static/js/lib/reveal/markdown.js',
            condition: function() {
              return !!document.querySelector('[data-markdown]');
            }
          }, {
            src: '/iblog/static/js/lib/reveal/highlight.min.js',
            async: true,
            callback: function() {
              hljs.initHighlightingOnLoad();
            }
          }, {
            src: '/iblog/static/js/lib/reveal/zoom.js',
            async: true,
            condition: function() {
              return !!document.body.classList;
            }
          }, {
            src: '/iblog/static/js/lib/reveal/notes.js',
            async: true,
            condition: function() {
              return !!document.body.classList;
            }
          }]
        });
      }
    }

    return postSlider;

  });
