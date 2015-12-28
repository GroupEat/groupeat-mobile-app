'use strict';
var servicename = 'AcceptHeaderInterceptor';

module.exports = function(app) {

  var dependencies = [];

  function service() {
    var request = function (config) {
      if (config.url.indexOf('groupeat') !== -1) {
        config.headers.Accept = 'application/vnd.groupeat.v1+json';
      }
      return config;
    };

    return {
      request: request
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
