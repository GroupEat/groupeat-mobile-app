'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-sanitize');
require('angular-animate');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'orders';

module.exports = function(namespace) {

  var common = require('../common')(namespace);
  var customer = require('../customer')(namespace);

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'ui.router',
    'ionic',
    'ngCordova',
    'ngResource',
  ]);
  app.namespace = app.namespace || {};
  app.namespace.common = common.name;
  app.namespace.customer = customer.name;

  // inject:folders start
  require('./controllers')(app);
require('./services')(app);
  // inject:folders end
  app.namespace = app.namespace || {};

  var configRoutesDeps = ['$stateProvider'];
  var configRoutes = function($stateProvider) {
    $stateProvider.state('app.group-orders', {
      url: '',
      views: {
        app: {
          template: require('./views/group-orders.html'),
          controller: app.name + '.GroupOrdersCtrl'
        }
      }
    });
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
