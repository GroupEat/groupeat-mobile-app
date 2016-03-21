'use strict';
var angular = require('angular');
require('angular-animate');
require('angular-auto-validate');
require('angular-cookies');
require('angular-moment');
require('angular-sanitize');
require('angular-sprintf');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-translate-storage-cookie');
require('angular-translate-storage-local');
require('angular-ui-router');
require('angular-validation-match');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'common';

module.exports = function(namespace) {

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'angularMoment',
    'ui.router',
    'ionic',
    'jcs-autoValidate',
    'LocalStorageModule',
    'ngConstants',
    'ngCordova',
    'ngCookies',
    'pascalprecht.translate',
    'sprintf',
    'validation.match'
  ]);
  app.namespace = app.namespace || {};

  // inject:folders start
  require('./directives')(app);
  require('./filters')(app);
  require('./services')(app);
  // inject:folders end
  require('./config')(app);
  require('./run')(app);

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
