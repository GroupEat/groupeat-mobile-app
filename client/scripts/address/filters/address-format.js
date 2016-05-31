'use strict';
var filtername = 'addressFormat';

module.exports = function(app) {

  var deps = [
    app.name + '.Geocoder'
  ];

  function filter(Geocoder) {
    return function(input) {
      var address = Geocoder.formatAddress(input);
      return input.street;
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
