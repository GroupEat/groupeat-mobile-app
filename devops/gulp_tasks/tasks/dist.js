/*eslint handle-callback-err:0,consistent-return:0, new-cap:0*/
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rename = $.rename;
var tap = $.tap;
var es = require('event-stream');
var Q = require('q');
var imagemin = $.imagemin;
var del = require('del');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var gmux = require('gulp-mux');
var runSequence = require('run-sequence');
var constants = require('../common/constants')();
var helper = require('../common/helper');
var fs = require('fs');
var XML = require('node-jsxml').XML;
var gutil = require('gulp-util');
var inquirer = require('inquirer');
var replace = require('gulp-replace');
var swig = require('gulp-swig');
var args = require('yargs').array('id').default('env', 'dev').argv;

gulp.task('clean', 'Clean distribution folder.', function(done) {
  del.sync([constants.distFolders[args.env]]);
  done();
});

gulp.task('ionic:config', false, function(done) {
  gulp.src('ionic.project')
  .pipe(gulp.dest(constants.distFolders[args.env]))
  .on('end', done);
});

gulp.task('copy', false, function(done) {
  var dest = constants.distFolders[args.env] + '/www';

  es.concat(
  gulp.src(constants.html.src)
      .pipe(rename('index.html'))
      .pipe(gulp.dest(dest)),
  gulp.src('./' + constants.clientFolder + '/*' + constants.targetSuffix + '.jade')
      .pipe(rename(function(path) {
          path.basename = path.basename.replace(constants.targetSuffix, '');
      }))
      .pipe(gulp.dest(dest)),
  gulp.src('./' + constants.clientFolder + '/404' + constants.targetSuffix + '.html')
      .pipe(rename('404.html'))
      .pipe(gulp.dest(dest)),
  gulp.src('./' + constants.clientFolder + '/favicon' + constants.targetSuffix + '.ico')
      .pipe(rename('favicon.ico'))
      .pipe(gulp.dest(dest)),
  gulp.src('./' + constants.clientFolder + '/robots' + constants.targetSuffix + '.txt')
      .pipe(rename('robots.txt'))
      .pipe(gulp.dest(dest)),
  gulp.src('./' + constants.clientFolder + '/apple-touch-icon' + constants.targetSuffix + '.png')
      .pipe(rename('apple-touch-icon.png'))
      .pipe(gulp.dest(dest)),
  gulp.src(constants.cordova.src + '/hooks/**/*.*')
      .pipe(gulp.dest(constants.distFolders[args.env] + '/hooks')),
  gulp.src([constants.cordova.src + '/package-hooks/*.{sh,js}'])
      .pipe(gulp.dest(constants.distFolders[args.env] + '/package-hooks')),
  gulp.src(['./bin/resources/*'])
      .pipe(gulp.dest(constants.distFolders[args.env] + '/resources'))
  )
  .on('end', done);
});

gulp.task('cordova:config', false, function(done) {
  var version = require('../../../package.json').version;
  gulp.src('./' + constants.clientFolder + '/config.xml')
  .pipe(swig({
    ext: '.xml',
    data: {
      version: version,
      env: args.env,
      appId: constants.appIds[args.env],
      appName: constants.appNames[args.env]
    }
  }))
  .pipe(gulp.dest(constants.distFolders[args.env]))
  .on('end', done);
});

gulp.task('copy:watch', false, function(done) {
  gulp.watch(constants.html.src, ['copy']);
});

gulp.task('angular:i18n', false, function(done) {
  var dest = constants.distFolders[args.env] + '/www';
  gulp.src('./bower_components/angular-i18n/*.js')
  .pipe(gulp.dest(dest + '/angular/i18n'))
  .on('end', done);
});

gulp.task('image:watch', false, function(done) {
  gulp.watch(gmux.sanitizeWatchFolders(constants.images.src), ['image']);
});

gulp.task('translations:watch', false, function(done) {
  gulp.watch(gmux.sanitizeWatchFolders(constants.translations.src), ['translations']);
})

gulp.task('image', false, function(done) {
  var dest = constants.distFolders[args.env] + '/www';
  gulp.src(constants.images.src, {
    base: constants.clientFolder
  })
  .pipe(imagemin())
  .pipe(gulp.dest(dest))
  .on('end', done);
});

gulp.task('translations', false, function(done) {
  var dest = constants.distFolders[args.env] + '/www';
  gulp.src(constants.translations.src, {
    base: constants.clientFolder
  })
  .pipe(gulp.dest(dest))
  .on('end', done);
});

gulp.task('dist', ['clean', 'bower:copy', 'ionic:config', 'ionic:platform-web-client', 'copy', 'envs', 'cordova:config', 'image', 'fonts', 'translations', 'angular:i18n', 'webpack:run', 'style']);

gulp.task('cordova:all', 'Build a binary for android (.apk) and ios (.ipa)', function(done) {
    return runSequence('dist', 'cordova:all:platform', 'deploy:prepare', 'wait', done);
});

gulp.task('bower:copy', false, function(done) {
  var files = ['./bower_components/**/*'];
  gulp.src(files)
  .pipe(gulp.dest(constants.distFolders[args.env] + '/www/lib'))
  .on('end', done);
});

gulp.task('wait', false, function(done) {
    setTimeout(function() {
        done();
    }, 3000);
});
