'use strict';
var gulp = require('gulp');
global.options = null;
require('gulp-help')(gulp, {
    hideDepsMessage: true
});
require('require-dir')('./devops/gulp_tasks/tasks');

// Because we are including gulp-help the syntax of a gulp task has an extra description param at position 2 - refer to https://www.npmjs.org/package/gulp-help

// add your top gulp tasks here
gulp.task('default', false, function() {

});
