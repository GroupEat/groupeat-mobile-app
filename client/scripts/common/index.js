'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-sanitize');
require('angular-animate');
require('angular-sprintf');
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
    'sprintf'
  ]);
  app.namespace = app.namespace || {};
  // inject:folders start
  require('./services')(app);
  // inject:folders end

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
          redirectTo: 'app.authentication'
        }
      }
    });
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
