function* test() {
  this.body = this.path;
}
module.exports = function(Router, options) {
  Router.register(['/router/test1', '/router/test2'], 'get', test);

  Router.register('/router/test3', 'get', function() {
    this.body = this.path;
  });

  Router.register('/router/test4', ['get'], function() {
    this.body = this.path;
  });
}