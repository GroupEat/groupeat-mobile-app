'use strict';
var filtername = 'addressFormat';

module.exports = function(app) {

  var deps = [];

  function filter() {
    return function(input) {
      return input.street;
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
