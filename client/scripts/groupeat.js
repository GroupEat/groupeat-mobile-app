'use strict';

var namespace = 'groupeat';
// fix protractor issue
if (window.location.toString().indexOf('localhost:5555') > 0) {
  window.name = 'NG_DEFER_BOOTSTRAP!NG_ENABLE_DEBUG_INFO!';
}
var angular = require('angular');
require('angular-ui-router');
require('angular-animate');
require('angular-messages');
require('angular-translate');
require('angular-sanitize');
require('angular-ui-mask');
require('ionic');
require('ionic-angular');
require('ionic-platform-web-client');
require('ionic-service-core');
require('ionic-service-deploy');

require('angular-moment');
require('angular-timer');

var app = angular.module(namespace, [
  'angularMoment',
  'ionic',
  'ionic.service.core',
  'ionic.service.deploy',
  'ionic.service.analytics',
  'ngConstants',
  'pascalprecht.translate',
  'timer',
  'ui.mask',
  // inject:modules start
  require('./authentication')(namespace).name,
  require('./common')(namespace).name,
  require('./customer')(namespace).name,
  require('./orders')(namespace).name,
  require('./push')(namespace).name,
  require('./restaurant')(namespace).name,
  require('./settings')(namespace).name
  // inject:modules end
]);

if (process.env.SENTRY_MODE === 'prod') {
  var configCompileDeps = ['$compileProvider'];
  var configCompile = function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  };
  configCompile.$inject = configCompileDeps;
  app.config(configCompile);
}

var runDeps = ['$ionicAnalytics', '$ionicPlatform', '$window', 'ionicDeployChannel'];
var run = function($ionicAnalytics, $ionicPlatform, $window, ionicDeployChannel) {
  $ionicPlatform.ready(function() {

    if (ionicDeployChannel === 'prod') {
      $ionicAnalytics.register();
    }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if ($window.StatusBar) {
      $window.StatusBar.styleDefault();
    }
    if ($window.TestFairy) {
      $window.TestFairy.begin(process.env.TESTFAIRY_IOS_APP_TOKEN);
    }
  });
};

run.$inject = runDeps;
app.run(run);

module.exports = app;
