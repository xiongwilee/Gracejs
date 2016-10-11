module.exports = function*() {
  function getData() {
    return function(callback) {
      setTimeout(function() {
        callback(0, { data: 'this is defaultCtrl!' });
      }, 100)
    }
  }

  return yield getData();

}
