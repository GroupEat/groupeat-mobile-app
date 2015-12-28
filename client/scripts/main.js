'use strict';

var namespace = 'main';
// fix protractor issue
if (window.location.toString().indexOf('localhost:5555') > 0) {
  window.name = 'NG_DEFER_BOOTSTRAP!NG_ENABLE_DEBUG_INFO!';
}
var angular = require('angular');
require('angular-ui-router');
require('angular-animate');
require('angular-translate');
require('angular-sanitize');
require('ionic');
require('ionic-angular');

var app = angular.module(namespace, [
  'ionic',
  'ngConstants',
  'pascalprecht.translate',
  // inject:modules start
  require('./authentication')(namespace).name,
  require('./common')(namespace).name,
  require('./customer')(namespace).name,
  require('./orders')(namespace).name,
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

var runDeps = ['$ionicPlatform', '$window'];
var run = function($ionicPlatform, $window) {
  $ionicPlatform.ready(function() {
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
