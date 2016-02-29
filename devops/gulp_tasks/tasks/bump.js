'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var fs = require('fs');
var args = require('yargs').default('type', 'patch').argv;

function getPackageJsonVersion () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

gulp.task('bump-version', function () {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: args.type}).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  var version = getPackageJsonVersion();
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[ci skip] Bumped to version ' + version));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'staging', cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag(version, '[ci skip] Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'staging', {args: '--tags'}, cb);
  });
});

gulp.task('release', function (callback) {
  runSequence(
    'bump-version',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});
