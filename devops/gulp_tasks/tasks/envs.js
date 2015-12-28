var gulp = require('gulp');
var gmux = require('gulp-mux');
var ngConstant = require('gulp-ng-constant');
var constants = require('../common/constants')();
var args = require('yargs').array('id').default('env', 'dev').argv;

gulp.task('envs', false, function(done) {
  var myConfig = require('../../envs.json');
  var envConfig = myConfig[args.env];
  return ngConstant({
      constants: envConfig,
      stream: true
    })
    .pipe(gulp.dest(constants.distFolders[args.env]+'/www/scripts'));
});
