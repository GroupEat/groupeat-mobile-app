'use strict';
var servicename = 'Autocompleter';

module.exports = function(app) {

  var dependencies = [
    '$q'
  ];

  function service($q) {

    var autocompleter = new google.maps.places.AutocompleteService();

    var getResults = function(input) {
      var deferred = $q.defer();
      autocompleter.getPlacePredictions({
        input: input
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          deferred.resolve(results);
        } else {
          deferred.reject(status);
        }
      });
      return deferred.promise;
    };

    return {
      getResults: getResults
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
