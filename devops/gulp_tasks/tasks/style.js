'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var es = require('event-stream');
var sass = $.sass;
var less = $.less;
//var sourcemaps = $.sourcemaps;
var autoprefixer = $.autoprefixer;
// var rename = $.rename;
var concat = $.concat;
var order = $.order;
var minifycss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var constants = require('../common/constants')();
var helper = require('../common/helper');
var gutil = $.util;
var args = require('yargs').array('id').default('env', 'dev').argv;

gulp.task('font', 'Copy fonts.', function(done) {
  var dest = constants.distFolders[args.env] + '/www/' + constants.fonts.dest;
  var srcFont = constants.fonts['src_' + constants.targetName];
  if (!srcFont) {
      srcFont = constants.fonts.src;
  }
  gulp.src(srcFont)
  .pipe(gulp.dest(dest))
  .on('end', done);
});

gulp.task('style', false, ['font'], function(done) {
  var dest = constants.distFolders[args.env] + '/www/' + constants.style.dest;

  var sassFiles = gulp.src(constants.style.sass.src)
  .pipe(sass({
      errLogToConsole: false,
      onError: function(err) {
          gutil.beep();
          gutil.log(gutil.colors.red('Sass failed'));
          gutil.log(gutil.colors.red(err.message));
          gutil.log(gutil.colors.red(err.file + ':' + err.line + ':' + err.column));
      }
  }))
  .pipe(concat('sass.css'));

  var lessFiles = gulp.src(constants.style.less.src)
  .pipe(less())
  .pipe(concat('less.css'));

  var cssFiles = gulp.src(constants.style.css.src)
  .pipe(concat('css.css'));

  es.concat(lessFiles, sassFiles, cssFiles)
  .pipe(order(['less.css', 'sass.css', 'css.css']))
  .pipe(concat(constants.style.destName))
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulpif(args.env !== 'dev', minifycss()))
  .pipe(gulp.dest(dest))
  .pipe($.size({
      title: 'css files',
      showFiles: true
  }))
  .pipe(es.wait(done));
});

gulp.task('style:watch', 'Watch changes for style files.', function(done) {
  gulp.watch(constants.style.watchFolder, ['style']);
});
