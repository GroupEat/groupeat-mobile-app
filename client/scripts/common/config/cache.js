'use strict';

module.exports = function(app) {

  var dependencies = [
    '$ionicConfigProvider'
  ];

  function config($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
  }

  config.$inject = dependencies;
  app.config(config);
};
