'use strict';
var servicename = 'PredefinedAddresses';

module.exports = function(app) {

  var dependencies = [
    '$q',
    '$resource',
    'apiEndpoint'
  ];

  function service($q, $resource, apiEndpoint) {
    var resource = $resource(apiEndpoint + '/predefinedAddresses');
    var get = function () {
      var defer = $q.defer();
      resource.get().$promise.then(function (response) {
        defer.resolve(response.data);
      }).catch(function () {
        defer.reject();
      });
      return defer.promise;
    };
    return { get: get };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
