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
  require('./filters')(app);
  require('./services')(app);
  // inject:folders end
  require('./run')(app);

  var configRoutesDeps = ['$stateProvider'];
  var configRoutes = function($stateProvider) {
    $stateProvider
    .state('app.customer-authentication', {
      url: '/customer-authentication',
      params: {
        slideIndex: 0
      },
      views: {
        app: {
          template: require('./views/customer-authentication.html'),
          controller: app.name + '.CustomerAuthenticationCtrl'
        }
      },
      data: { permissions: { except: [] } }
    })
    .state('app.signup', {
      url: '/signup',
      params: {
        slideIndex: 0
      },
      views: {
        app: {
          template: require('./views/signup.html'),
          controller: app.name + '.SignupCtrl'
        }
      },
      data: { permissions: { except: [] } }
    });
  };
  configRoutes.$inject = configRoutesDeps;
  app.config(configRoutes);

  return app;
};
