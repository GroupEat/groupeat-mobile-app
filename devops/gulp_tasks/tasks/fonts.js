'use strict';

var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var constants = require('../common/constants')();
var args = require('yargs').array('id').default('env', 'dev').argv;
var gmux = require('gulp-mux');

var fontName = 'icons';
var runTimestamp = Math.round(Date.now()/1000);

gulp.task('fonts', function(){
  gulp.src(['client/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'client/styles/fonts/templates/_icons.scss',
      targetPath: '../../styles/fonts/_icons.scss',
      fontPath: '../fonts/Groupeat/',
      cssClass: 'gp'
    }))
    .pipe(iconfont({
      fontName: fontName,
      appendUnicode: true,
      timestamp: runTimestamp
     }))
    .pipe(gulp.dest(constants.distFolders[args.env] + '/www/fonts/Groupeat/'));
});

gulp.task('fonts:watch', false, function(done) {
  gulp.watch(gmux.sanitizeWatchFolders(constants.fonts.src), ['fonts']);
});
