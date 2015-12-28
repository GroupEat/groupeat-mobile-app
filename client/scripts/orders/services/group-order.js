'use strict';
var servicename = 'GroupOrder';

module.exports = function(app) {

  var dependencies = [
    '$resource',
    '$q',
    'apiEndpoint'
  ];

  function service($resource, $q, apiEndpoint) {
    var resource = $resource(apiEndpoint + '/groupOrders?joinable=1&around=1&latitude=:latitude&longitude=:longitude&include=restaurant');
    var
    /**
    * @ngdoc function
    * @name GroupOrder#get
    * @methodOf GroupOrder
    *
    * @description
    * Returns a promise resolved with the list of current group orders if the server responds properly
    * Else the promise is rejected
    * https://groupeat.fr/docs
    *
    */
    get = function (latitude, longitude) {
      var defer = $q.defer();
      resource.get({
        latitude: latitude,
        longitude: longitude
      }).$promise.then(function (response) {
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
