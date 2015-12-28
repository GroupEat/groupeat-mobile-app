'use strict';
var servicename = 'Network';

module.exports = function(app) {

  var dependencies = [
    '$q'
  ];

  function service($q) {

    var hasConnectivity = function() {
      var deferred = $q.defer();
      // If we are on a computer, this will not be defined and we return true
      if (!window.Connection || navigator.connection.type !== Connection.NONE) {
        deferred.resolve();
      } else {
        deferred.reject('noNetwork');
      }
      return deferred.promise;
    };

    return {
      hasConnectivity: hasConnectivity
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
