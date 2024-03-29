'use strict';
var angular = require('angular');
require('angular-animate');
require('angular-moment');
require('angular-sanitize');
require('angular-slick');
require('angular-ui-router');
require('ionic');
require('ionic-angular');
require('ng-cordova');
require('slick-carousel');

var modulename = 'orders';

module.exports = function(namespace) {

  var authentication = require('../authentication')(namespace);
  var common = require('../common')(namespace);
  var customer = require('../customer')(namespace);

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'angularMoment',
    'ui.router',
    'ionic',
    'ngCordova',
    'ngResource',
    'slick',
    common.name,
    customer.name
  ]);
  app.namespace = app.namespace || {};
  app.namespace.authentication = authentication.name;
  app.namespace.common = common.name;
  app.namespace.customer = customer.name;

  // inject:folders start
  require('./controllers')(app);
  require('./directives')(app);
  require('./services')(app);
  // inject:folders end
  app.namespace = app.namespace || {};

  var configRoutesDeps = ['$stateProvider'];
  var configRoutes = function($stateProvider) {
    $stateProvider
    .state('app.group-orders', {
      url: '',
      views: {
        app: {
          template: require('./views/group-orders.html'),
          controller: app.name + '.GroupOrdersCtrl'
        }
      }
    })
    .state('app.orders', {
      url: '/orders',
      views: {
        app: {
          template: require('./views/orders.html'),
          controller: app.name + '.OrdersCtrl'
        }
      }
    });
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
