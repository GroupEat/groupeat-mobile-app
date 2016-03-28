'use strict';
var gulp = require('gulp');
// var $ = require('gulp-load-plugins')();
//var webserver = $.webserver;
var browserSync = require('browser-sync');
//var openBrowser = require('open');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var chalk = require('chalk');
var gmux = require('gulp-mux');
var exec = require('child_process').exec;
var constants = require('../common/constants')();
var helper = require('../common/helper');
var args = require('yargs').array('id').default('env', 'dev').argv;
var _ = require('lodash');

gulp.task('browsersyncstart', false, function(done) {
  var dest = constants.distFolders[args.env] + '/www';
  var open = constants.serve.open;
  if (!_.isUndefined(args.browser)) {
      open = args.browser;
  }

  var config = {
      files: [dest + '/index.html', dest + '/' + constants.script.dest + '/' + constants.bundleName, dest + '/' + constants.style.dest + '/' + constants.style.destName],
      tunnel: constants.serve.localtunnel,
      server: {
          baseDir: args.env === 'dev' || args.env === 'local' ? dest : [dest, constants.exorcist.dest],
          routes: {},
          middleware: [
              function(req, res, next) {
                  //console.log("Hi from middleware");
                  next();
              }
          ]
      },
      host: constants.serve.host,
      port: constants.serve.port,
      logLevel: 'info', // info, debug , silent
      open: open,
      browser: constants.serve.browser, //['google chrome'], // ['google chrome', 'firefox'],
      notify: true,
      logConnections: false,
      ghostMode: constants.serve.ghostMode
  };

  browserSync(config);

  var platform = global.options.platform || constants.cordova.platform;
  if (helper.isMobile(constants)) {
      gutil.log('Launching ' + platform + ' emulator');
      exec('../../../node_modules/.bin/ionic emulate ' + platform + ' --livereload', {
          cwd: dest,
          maxBuffer: constants.maxBuffer
      }, helper.execHandler);
  }
});

gulp.task('browsersync', function(done) {
  runSequence('clean',
  ['ionic:platform-web-client', 'webpack:watch', 'bower:copy', 'style', 'image', 'fonts', 'translations', 'copy', 'envs', 'cordova:config', 'angular:i18n'],
  ['browsersyncstart', 'style:watch', 'image:watch', 'translations:watch', 'copy:watch'], done);
});
