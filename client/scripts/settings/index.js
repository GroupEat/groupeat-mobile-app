'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-sanitize');
require('angular-animate');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'settings';

module.exports = function(namespace) {

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, ['ui.router', 'ionic', 'ngCordova']);
  // inject:folders start
  // inject:folders end
  app.namespace = app.namespace || {};

  var configRoutesDeps = ['$stateProvider'];
  var configRoutes = function($stateProvider) {
    $stateProvider.state('app.settings', {
      url: '/settings',
      views: {
        app: {
          template: require('./views/settings.html'),
          controller: 'SettingsCtrl'
        }
      }
    });
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
