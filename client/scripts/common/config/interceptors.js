'use strict';

module.exports = function(app) {

  var dependencies = [
    '$httpProvider'
  ];

  function config($httpProvider) {
    $httpProvider.interceptors.push(app.name+'.AcceptHeaderInterceptor');
  }

  config.$inject = dependencies;
  app.config(config);
};
