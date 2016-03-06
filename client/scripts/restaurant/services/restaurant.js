'use strict';
var servicename = 'Restaurant';

module.exports = function(app) {

  var dependencies = [
    app.namespace.common + '.Lodash',
    '$resource',
    '$q',
    'apiEndpoint',
    app.namespace.common + '.Popup'
  ];

  function service(_, $resource, $q, apiEndpoint, Popup) {
    var resource = $resource(apiEndpoint + '/restaurants/:id');
    var listResource = $resource(apiEndpoint + '/restaurants?around=1&latitude=:latitude&longitude=:longitude');
    var listResourceOpened = $resource(apiEndpoint + '/restaurants?opened=1&around=1&latitude=:latitude&longitude=:longitude');
    var
    /**
    * @ngdoc function
    * @name Restaurant#getFromCoordinates
    * @methodOf Restaurant
    *
    * @description
    * Returns a promise resolved with the list of restaurants if the server responds properly
    * Else the promise is rejected
    * https://groupeat.fr/docs
    *
    */
    getFromCoordinates = function (latitude, longitude) {
      var defer = $q.defer();
      listResource.get({latitude: latitude, longitude: longitude}).$promise
      .then(function (response) {
        defer.resolve(response.data);
      })
      .catch(function () {
        defer.reject();
      });
      return defer.promise;
    },

    /**
    * @ngdoc function
    * @name Restaurant#getOnlyOpenedFromCoordinates
    * @methodOf Restaurant
    *
    * @description
    * Returns a promise resolved with the list of currently opened restaurants if the server responds properly
    * Else the promise is rejected
    * https://groupeat.fr/docs
    *
    */
    getOnlyOpenedFromCoordinates = function (latitude, longitude) {
      var defer = $q.defer();
      listResourceOpened.get({latitude: latitude, longitude: longitude}).$promise
      .then(function (response) {
        defer.resolve(response.data);
      })
      .catch(function () {
        defer.reject();
      });
      return defer.promise;
    },

    /**
    * @ngdoc function
    * @name Restaurant#get
    * @methodOf Restaurant
    *
    * @description
    * Returns a promise resolved with the restaurant
    * Else the promise is rejected
    * https://groupeat.fr/docs
    *
    */
    get = function (restaurantId) {
      var defer = $q.defer();
      resource.get({id: restaurantId}).$promise
      .then(function (response) {
        defer.resolve(response.data);
      })
      .catch(function () {
        defer.reject();
      });
      return defer.promise;
    },

    /**
    * @ngdoc function
    * @name Customer#checkGroupOrders
    * @methodOf Customer
    * @param {integer} restaurantId
    * @param {array} groupOrders
    *
    * @description Returns a promise informing wether or not the customer has already activated his/her account
    */
    checkGroupOrders = function (restaurantId, groupOrders) {
      var deferred = $q.defer();
      var existingGroupOrder = _.find(groupOrders, 'restaurant.data.id', restaurantId);
      if (existingGroupOrder) {
        Popup.confirm('restaurantHasGroupOrder', 'restaurantHasGroupOrderMessage', 'joinIt!')
        .then(function(res) {
          if (res) {
            deferred.resolve(existingGroupOrder);
          } else {
            deferred.reject();
          }
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };

    return {
      checkGroupOrders: checkGroupOrders,
      get: get,
      getFromCoordinates : getFromCoordinates,
      getOnlyOpenedFromCoordinates : getOnlyOpenedFromCoordinates
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
