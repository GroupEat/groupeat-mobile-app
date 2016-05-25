'use strict';
var filtername = 'addressFormat';

module.exports = function(app) {

  var deps = [];

  function filter() {
    return function(input) {
      return input.street + ', ' + input.postcode + ' ' + input.city + ', ' + input.country;
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
