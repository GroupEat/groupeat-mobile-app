'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-sanitize');
require('angular-animate');
require('angular-local-storage');
require('angular-resource');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'customer';

module.exports = function(namespace) {

  var authentication = require('../authentication')(namespace);
  var common = require('../common')(namespace);

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'ui.router',
    'ionic',
    'LocalStorageModule',
    'ngCordova',
    'ngResource',
  ]);
  app.namespace = app.namespace || {};
  app.namespace.authentication = authentication.name;
  app.namespace.common = common.name;

  // inject:folders start
  require('./controllers')(app);
  require('./run')(app);
  require('./services')(app);
  // inject:folders end

  var configRoutesDeps = ['$stateProvider'];
  var configRoutes = function($stateProvider) {
    $stateProvider.state('app.customer-authentication', {
      url: '/customer-authentication',
      views: {
        app: {
          template: require('./views/customer-authentication.html'),
          controller: app.name + '.CustomerAuthenticationCtrl'
        }
      }
    });
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
