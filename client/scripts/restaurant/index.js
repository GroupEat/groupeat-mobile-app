'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-sanitize');
require('angular-animate');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'restaurant';

module.exports = function(namespace) {

  var authentication = require('../authentication')(namespace);
  var common = require('../common')(namespace);
  var customer = require('../customer')(namespace);
  var orders = require('../orders')(namespace);

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
  app.namespace.orders = orders.name;

  // inject:folders start
  require('./controllers')(app);
  require('./directives')(app);
  require('./services')(app);
  // inject:folders end
  app.namespace = app.namespace || {};

  var configRoutesDeps = ['$stateProvider'];
  var configRoutes = function($stateProvider) {
    $stateProvider
    .state('app.restaurants', {
      url: '/restaurants',
      views: {
        app: {
          template: require('./views/restaurants.html'),
          controller: app.name + '.RestaurantsCtrl'
        }
      }
    })
    .state('app.restaurant-menu', {
    url: '/restaurant/:restaurantId/menu',
    views: {
      app: {
        template: require('./views/restaurant-menu.html'),
        controller: app.name + '.RestaurantMenuCtrl'
      }
    }
  })
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
