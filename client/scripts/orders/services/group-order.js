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
    * @name GroupOrder#getFromAddress
    * @methodOf GroupOrder
    *
    * @description
    * Returns a promise resolved with the list of current group orders if the server responds properly
    * Else the promise is rejected
    * https://groupeat.fr/docs
    *
    */
    getFromAddress = function (address) {
      var defer = $q.defer();
      if (!address || !address.latitude || !address.longitude) {
        defer.reject('noAddress');
      } else {
        resource.get({
          latitude: address.latitude,
          longitude: address.longitude
        }).$promise.then(function (response) {
          defer.resolve(response.data);
        }).catch(function () {
          defer.reject();
        });
      }

      return defer.promise;
    };
    return { getFromAddress: getFromAddress };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
