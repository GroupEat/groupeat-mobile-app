'use strict';
var angular = require('angular');
require('angular-animate');
require('angular-messages');
require('angular-sanitize');
require('angular-ui-router');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'settings';

module.exports = function(namespace) {

  var authentication = require('../authentication')(namespace);
  var common = require('../common')(namespace);
  var customer = require('../customer')(namespace);

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'ui.router',
    'ionic',
    'ngCordova',
    'ngResource',
    'ngMessages',
    authentication.name,
    common.name,
    customer.name
  ]);
  app.namespace = app.namespace || {};
  app.namespace.authentication = authentication.name;
  app.namespace.common = common.name;
  app.namespace.customer = customer.name;

  // inject:folders start
  require('./controllers')(app);
  // inject:folders end
  app.namespace = app.namespace || {};

  var configRoutesDeps = ['$stateProvider'];
  var configRoutes = function($stateProvider) {
    $stateProvider.state('app.settings', {
      url: '/settings',
      views: {
        app: {
          template: require('./views/settings.html'),
          controller: app.name + '.SettingsCtrl'
        }
      }
    });
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
