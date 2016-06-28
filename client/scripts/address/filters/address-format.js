'use strict';
var filtername = 'addressFormat';

module.exports = function(app) {

  var deps = [
    app.namespace.common + '.Lodash',
    app.name + '.Geocoder',
  ];

  function filter(_, Geocoder) {
    return function(input, format) {
      var address = Geocoder.formatAddress(input);
      if (!format) {
        return address.street;
      }
      _.forEach(address, function(value, field){
        format = format.replace(field, value);
      });
      return format;

    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
