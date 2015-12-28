'use strict';
var servicename = 'AuthenticationInterceptor';

module.exports = function(app) {

  var dependencies = [
    app.namespace.common + '.Lodash',
    '$injector',
    '$q'
  ];

  function service(_, $injector, $q) {
    var request = function (config) {
      if (config.url.indexOf('groupeat') !== -1) {
        var credentials = $injector.get(app.name+'.Credentials').get(false);
        if (credentials && credentials.token) {
          config.headers.Authorization = 'bearer ' + credentials.token;
        }
      }
      return config;
    },

    responseError = function(response) {
      var responseStatusRequiringAuthentication = [401, 403];
      var keysRequiringRedirection = [
        'userMustAuthenticate',
        'invalidAuthenticationTokenSignature',
        'obsoleteAuthenticationToken',
        'noUserForAuthenticationToken'
      ];
      if (_.includes(responseStatusRequiringAuthentication, response.status) && _.has(response, 'data.data.errorKey') && _.includes(keysRequiringRedirection, response.data.data.errorKey)) {
        $injector.get('$state').go('app.customer-authentication');
      }
      return $q.reject(response);
    };

    return {
      request: request,
      responseError: responseError
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
