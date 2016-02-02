'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-sanitize');
require('angular-animate');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'push';

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
    authentication.name,
    common.name
  ]);
  app.namespace = app.namespace || {};
  app.namespace.authentication = authentication.name;
  app.namespace.common = common.name;
  // inject:folders start
  require('./services')(app);
  // inject:folders end
  require('./run')(app);
  app.namespace = app.namespace || {};

  return app;
};
