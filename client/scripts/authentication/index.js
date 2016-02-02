'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-sanitize');
require('angular-animate');
require('angular-local-storage');
require('angular-permission');
require('angular-resource');
require('ionic');
require('ionic-angular');
require('ng-cordova');

var modulename = 'authentication';

module.exports = function(namespace) {

  var common = require('../common')(namespace);

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'ui.router',
    'ionic',
    'LocalStorageModule',
    'ngCordova',
    'ngResource',
    'permission',
    common.name
  ]);
  app.namespace = app.namespace || {};
  app.namespace.common = common.name;

  // inject:folders start
  require('./services')(app);
  // inject:folders end
  require('./config')(app);
  require('./run')(app);

  return app;
};
