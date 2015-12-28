var gulp = require('gulp');
var exec = require('child_process').exec;
var gmux = require('gulp-mux');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var constants = require('../common/constants')();
var helper = require('../common/helper');
var args = require('yargs').array('id').default('env', 'integration').argv;
var _ = require('lodash');
var swig = require('gulp-swig');
var es = require('event-stream');
var chalk = require('chalk');

var distFolder = './dist/app/prod';

gulp.task('deploy:prepare', 'Prepares the files needed to deploy mobile applications', function(done) {
  var version = require('../../../package.json').version;
  es.concat(
    gulp.src('./devops/deploy/ios/manifest.plist')
    .pipe(swig({
      ext: '.plist',
      data: {
        version: version,
        env: args.env
      }
    }))
    .pipe(gulp.dest(constants.deployFolder)),
    gulp.src('./devops/deploy/index.html')
    .pipe(swig({
      data: {
        version: version,
        env: args.env
      }
    }))
    .pipe(gulp.dest(constants.deployFolder))
  )
  .on('end', done);
});

gulp.task('deploy:check', false, function(done) {
  var success = 0;

  function test(id) {
    var cmd = '../../../node_modules/.bin/ionic package info ' + id + ' | grep status'
    exec(cmd, {
        cwd: distFolder,
        maxBuffer: constants.maxBuffer
    }, function(err, stdout, stderr) {
      if(stdout.match(/SUCCESS/)){
        success++;
      } else if (stdout.match(/QUEUED/)){
        done(new Error(chalk.red("Build "+id+" is still queued")));
      } else if (stdout.match(/FAILED/)){
        done(new Error(chalk.red("Build "+id+" failed")));
      } else {
        console.log(stdout.trim());
        done(new Error(chalk.red("Build "+id+" has an unknown status")));
      }
      if(success === args.id.length){
        done();
      }
    });
  }
  _.map(args.id, test);
});

gulp.task('deploy:download', false, ['deploy:check'], function(done) {
  function getDownloadCLI(id) {
    return '../../../node_modules/.bin/ionic package download ' + id + ' -d deploy';
  }
  exec(_.map(args.id, getDownloadCLI).join(' && '), {
      cwd: distFolder,
      maxBuffer: constants.maxBuffer
  }, function(err, stdout, stderr) {
    helper.debug(stdout);
    done();
  });
});

gulp.task('soft-deploy', "Updates the app using ionic deploy only, usefull for testing", ['dist', 'compile:copy-package-json'], function(done) {
  var task = exec('../../../node_modules/.bin/ionic upload --deploy='+args.env, {
      cwd: distFolder
  }, function(err, stdout, stderr) {
    done();
  });
});

gulp.task('deploy:update', false, function(done) {
  var task = exec('../../../node_modules/.bin/ionic upload --deploy='+args.env, {
      cwd: distFolder
  }, function(err, stdout, stderr) {
    done();
  });
});

gulp.task('deploy', ['deploy:prepare', 'deploy:download', 'deploy:update', 'deploy:upload']);
gulp.task('deploy:local', ['deploy:prepare', 'deploy:local:prepare', 'deploy:update', 'deploy:upload']);
