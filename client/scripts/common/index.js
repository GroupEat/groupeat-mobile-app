'use strict';
var angular = require('angular');
require('angular-cookies');
require('angular-ui-router');
require('angular-sanitize');
require('angular-animate');
require('angular-sprintf');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-translate-storage-cookie');
require('angular-translate-storage-local');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'common';

module.exports = function(namespace) {

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'ui.router',
    'ionic',
    'ngCordova',
    'ngCookies',
    'pascalprecht.translate',
    'sprintf'
  ]);
  app.namespace = app.namespace || {};

  // inject:folders start
  require('./services')(app);
  // inject:folders end
  require('./config')(app);

  var configRoutesDeps = ['$stateProvider', '$urlRouterProvider'];
  var configRoutes = function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get('$state');
      $state.go('app.group-orders');
    });
    $stateProvider.state('app', {
      url: '',
      abstract: true,
      template: require('./views/app.html'),
      data: {
        permissions: {
          only: ['customer'],
          redirectTo: 'app.customer-authentication'
        }
      }
    });
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
