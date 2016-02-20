var gulp = require('gulp');
var exec = require('child_process').exec;
var constants = require('../common/constants')();
var helper = require('../common/helper');
var args = require('yargs').array('id').default('env', 'dev').array("platform").default("platform", ["android", "ios"]).argv;
var _ = require('lodash');

gulp.task('compile', "Builds and compiles the app using ionic package", ['dist', 'compile:copy-package-json'], function(done) {
  function generateCmd(platform){
    cmd = '../../../node_modules/.bin/ionic package build ' + platform + ' --profile ' + args.env;
    if (args.env === 'prod') {
      cmd += ' --release';
    }
    helper.debug('Will run : ' + cmd);
    return cmd;
  }
  exec(_.map(args.platform, generateCmd).join(' && '), {
    cwd: constants.distFolders[args.env],
    maxBuffer: constants.maxBuffer
  }, function(err, stdout, stderr) {
    helper.execHandler(err, stdout, stderr);
    done();
  });
});

gulp.task('compile:copy-package-json', false, ['dist'], function(done) {
  gulp.src("package.json").pipe(gulp.dest(constants.distFolders[args.env]))
  .on('end', done);
});
