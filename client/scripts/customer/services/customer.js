'use strict';
var servicename = 'Customer';

module.exports = function(app) {

  var dependencies = [
    '$q',
    '$resource',
    '$state',
    'apiEndpoint',
    app.namespace.common + '.BackendUtils',
    app.namespace.authentication + '.Credentials',
    app.name + '.CustomerStorage',
    'localStorageService',
    app.name + '.PhoneFormat',
    app.namespace.common + '.Popup'
  ];

  function service($q, $resource, $state, apiEndpoint, BackendUtils, Credentials, CustomerStorage, localStorageService, PhoneFormat, Popup) {

    var resource = $resource(apiEndpoint + '/customers/:id', null, { 'update': { method: 'PUT' } });

    var
    /**
    * @ngdoc function
    * @name Customer#get
    * @methodOf Customer
    *
    * @description
    * Returns a promise
    * If fulfilled, will have customer information
    * https://groupeat.fr/docs
    *
    * @param {String} customerId - The id of the customer
    */
    get = function(customerId) {
      var defer = $q.defer();
      resource.get({id: customerId}).$promise
      .then(function(response) {
        var user = response.data;
        if (user.phoneNumber) {
          user.phoneNumber = PhoneFormat.formatPhoneNumberForFrontend(user.phoneNumber);
        }
        defer.resolve(user);
      })
      .catch(function(errorResponse) {
        if (errorResponse.status === 404) {
          $state.go('app.customer-authentication');
        }
        defer.reject();
      });
      return defer.promise;
    },

    /**
    * @ngdoc function
    * @name Customer#save
    * @methodOf Customer
    *
    * @description
    * Registers a new customer and returns a promise
    * if fulfilled, will have the id and the token of the customer
    * if rejected, an error message in proper locale will be rejected
    * https://groupeat.fr/docs
    *
    * @param {Object} requestBody - must contain an 'email' and 'password' field
    */
    save = function (requestBody) {
      var defer = $q.defer();
      resource.save(null, requestBody).$promise
      .then(function (response) {
        defer.resolve(response.data);
      })
      .catch(function (errorResponse) {
        defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
      });
      return defer.promise;
    },

    /**
    * @ngdoc function
    * @name Customer#update
    * @methodOf Customer
    *
    * @description
    * Patches a customer and returns a promise
    * if rejected, an error message in proper locale will be rejected
    * https://groupeat.fr/docs
    *
    * @param {String} customerId the id of the customer to update
    * @param {Object} requestBody the fields to update for the customer
    */
    update = function (customerId, requestBody) {
      var defer = $q.defer();
      if (requestBody.phoneNumber) {
        requestBody.phoneNumber = PhoneFormat.formatPhoneNumberForBackend(requestBody.phoneNumber);
      }
      resource.update({id: customerId}, requestBody).$promise
      .then(function (response) {
        if (response.data) {
          response.data.phoneNumber = PhoneFormat.formatPhoneNumberForFrontend(response.data.phoneNumber);
        }
        defer.resolve(response.data);
      })
      .catch(function (errorResponse) {
        defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
      });
      return defer.promise;
    };

    return {
      get: get,
      save: save,
      update: update,
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
