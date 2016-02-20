var gulp = require('gulp');
var exec = require('child_process').exec;
var constants = require('../common/constants')();
var args = require('yargs').array('id').default('env', 'dev').array("platform").default("platform", ["android", "ios"]).argv;
var _ = require('lodash');
var runSequence = require('run-sequence');
var helper = require('../common/helper');

gulp.task('state:reset', function(done) {
  exec('../../../node_modules/.bin/ionic state reset', {
    cwd: constants.distFolders[args.env],
    maxBuffer: constants.maxBuffer
  }, function(err, stdout, stderr) {
    helper.execHandler(err, stdout, stderr);
    done();
  });
});

gulp.task('resources', function(done) {
  exec('../../../node_modules/.bin/ionic resources', {
    cwd: constants.distFolders[args.env],
    maxBuffer: constants.maxBuffer
  }, function(err, stdout, stderr) {
    helper.execHandler(err, stdout, stderr);
    done();
  });
});

gulp.task('build:ios', function(done) {
  exec('../../../node_modules/.bin/ionic build ios --device --release', {
    cwd: constants.distFolders[args.env],
    maxBuffer: constants.maxBuffer
  }, function(err, stdout, stderr) {
    helper.execHandler(err, stdout, stderr);
    done();
  });
});

gulp.task('build:prepare:android', function(done) {
  gulp.src('./devops/deploy/android/'+args.env+'/release-signing.properties')
  .pipe(gulp.dest(constants.distFolders[args.env] + '/platforms/android'))
  .on('end', done);
});

gulp.task('build:android', ['build:prepare:android'], function(done) {
  exec('../../../node_modules/.bin/ionic build android --device --release', {
    cwd: constants.distFolders[args.env],
    maxBuffer: constants.maxBuffer
  }, function(err, stdout, stderr) {
    helper.execHandler(err, stdout, stderr);
    done();
  });
});

gulp.task('build', function(done) {
  runSequence(['dist', 'compile:copy-package-json'],
  'state:reset',
  'resources',
  ['build:android'],
  done);
});
