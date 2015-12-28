'use strict';
var servicename = 'Authentication';

module.exports = function(app) {

  var dependencies = [
    '$filter',
    '$q',
    '$resource',
    app.namespace.common + '.BackendUtils',
    'apiEndpoint'
  ];

  function service($filter, $q, $resource, BackendUtils, apiEndpoint) {
    var authenticationResource = $resource(apiEndpoint + '/auth/token', null, {
      'authenticate': { method: 'PUT' }
    }),

    passwordResource = $resource(apiEndpoint + '/auth/password', null, {
      'update': { method: 'PUT' },
      'reset': { method: 'DELETE' }
    });

    var $translate = $filter('translate');

    var
    /**
    * @ngdoc function
    * @name Authentication#authenticate
    * @methodOf Authentication
    *
    * @description
    * Returns a promise for fetching the user token from the backend
    *
    * @param {Object} credentials - A javascript object containing at least the email and password of the user
    * @return {String} a javascript object containing the user token, id and activation status
    */
    authenticate = function (credentials) {
      var deferred = $q.defer();
      authenticationResource.authenticate(null, credentials).$promise
      .then(function(response) {
        deferred.resolve(response.data);
      })
      .catch(function(errorResponse) {
        deferred.reject(BackendUtils.errorMsgFromBackend(errorResponse));
      });
      return deferred.promise;
    },

    /**
    * @ngdoc function
    * @name Authentication#resetPassword
    * @methodOf Authentication
    *
    * @description
    * Returns a promise
    * If resolved, the password link will have been sent to the customer's email
    * If rejected, the error response from the server will be rejected
    *
    * @param {String} email - The email of the customer
    */
    resetPassword = function (email) {
      var deferred = $q.defer();
      passwordResource.reset(null, { email: email }).$promise
      .then(function () {
        deferred.resolve();
      })
      .catch(function (errorResponse) {
        deferred.reject(BackendUtils.errorKeyFromBackend(errorResponse));
      });
      return deferred.promise;
    },

    /**
    * @ngdoc function
    * @name Authentication#updatePassword
    * @methodOf Authentication
    *
    * @description
    * Returns a promise
    * It will be resolved in the following cases :
    * - The old and new password were not provided (the customer does not wish to edit his/her password)
    * - Both were provided, the old password was valid, the new password was validated and it was successfully changed
    * It will be rejected in the following cases :
    * - The old password was incorrect or not provided (with a new one provided)
    * - The new password was invalid or not provided (with the old one provided)
    *
    * @param {Object} authenticationParams - Authentication params (possibly with oldPassword, newPassword and email properties)
    */
    updatePassword = function (authenticationParams) {
      var deferred = $q.defer();
      if (!authenticationParams.oldPassword && !authenticationParams.newPassword) {
        deferred.resolve();
      } else if (authenticationParams.oldPassword && !authenticationParams.newPassword) {
        deferred.reject($translate('newPasswordNotProvided'));
      } else if (authenticationParams.newPassword && !authenticationParams.oldPassword) {
        deferred.reject($translate('oldPasswordNotProvided'));
      } else {
        passwordResource.update(null, authenticationParams).$promise
        .then(function () {
          deferred.resolve();
        })
        .catch(function (errorResponse) {
          deferred.reject(BackendUtils.errorMsgFromBackend(errorResponse));
        });
      }
      return deferred.promise;
    };

    return {
      authenticate: authenticate,
      resetPassword: resetPassword,
      updatePassword: updatePassword
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
