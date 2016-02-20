'use strict';
var servicename = 'Geolocation';

module.exports = function(app) {

  var dependencies = [
    '$cordovaGeolocation',
    '$q',
    'ionicDeployChannel',
    'localStorageService'
  ];

  function service($cordovaGeolocation, $q, ionicDeployChannel, localStorageService) {
    var getGeolocation = function () {
      var defer = $q.defer();
      if (ionicDeployChannel !== 'prod' || localStorageService.get('id') === "1") {
        var response = {
          'coords': {
            'latitude': 48.710734,
            'longitude': 2.2182329
          }
        };
        defer.resolve(response);
      } else {
        document.addEventListener('deviceready', function() {
          var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(function (currentPosition) {
            defer.resolve(currentPosition);
          }, function () {
            defer.reject('noGeolocation');
          });
        }, false);
      }
      return defer.promise;
    };
    return { getGeolocation: getGeolocation };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
