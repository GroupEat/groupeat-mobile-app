'use strict';
var servicename = 'Product';

module.exports = function(app) {

  var dependencies = [
    app.namespace.common + '.Lodash',
    '$q',
    '$resource',
    'apiEndpoint'
  ];

  function service(_, $q, $resource, apiEndpoint) {
    var resource = $resource(apiEndpoint + '/restaurants/:restaurantId/products?include=formats,tags');

    var
    /**
    * @ngdoc function
    * @name Product#get
    * @methodOf Product
    *
    * @description
    * Returns a promise which, if resolved, has the list of products for a given restaurant id
    * https://groupeat.fr/docs
    *
    */
    get = function (restaurantId) {
      var defer = $q.defer();
      resource.get({ restaurantId: restaurantId }).$promise.then(function (response) {
        var products = response.data;
        _.forEach(products, function (product) {
          _.forEach(product.formats.data, function (format) {
            format.price = format.price / 100;
          });
        });
        defer.resolve(products);
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
