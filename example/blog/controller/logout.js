'use strict';
module.exports = function*() {
  this.cookies.set('USER_ID', '', {
    expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  });
  this.redirect('/home');
}