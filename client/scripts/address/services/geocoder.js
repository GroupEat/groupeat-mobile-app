'use strict';
var servicename = 'Geocoder';

module.exports = function(app) {

  var dependencies = [
    '$q'
  ];

  function service($q) {

    var geocoder = new google.maps.Geocoder();

    var geocode = function(address) {
      var deferred = $q.defer();
      geocoder.geocode({
        address: address,
        componentRestrictions: {
          country: 'FR'
        }
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          deferred.resolve(results);
        } else {
          deferred.reject(status);
        }
      });
      return deferred.promise;
    };

    return {
      geocode: geocode
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
