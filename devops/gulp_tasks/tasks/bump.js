'use strict';

var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')();
var bump = $.bump;
var tap = $.tap;
var gulpif = $.if;
var Q = require('q');
var helper = require('../common/helper');
var constants = require('../common/constants')();

/**
 * Bumps any version in the constants.versionFiles
 *
 * USAGE:
 * gulp bump --minor (or --major or --prerelease or --patch which is the default)
 * - or -
 * gulp bump --ver=1.2.3
 * @param {function} cb - The gulp callback
 * @returns {void}
 */
gulp.task('bump', false, function(cb) {
    var bumpType = 'patch';
    // major.minor.patch
    if (args.patch) {
        bumpType = 'patch';
    }
    if (args.minor) {
        bumpType = 'minor';
    }
    if (args.major) {
        bumpType = 'major';
    }
    if (args.prerelease) {
        bumpType = 'prerelease';
    }
    bumpType = process.env.BUMP || bumpType;

    var version;
    var srcjson = helper.filterFiles(constants.versionFiles, '.json');

    // first we bump the json files
    gulp.src(srcjson)
        .pipe(gulpif(args.ver !== undefined, bump({
            version: args.ver
        }), bump({
            type: bumpType
        })))
        .pipe(tap(function(file) {
            if (!version) {
                var json = JSON.parse(String(file.contents));
                version = json.version;
            }
        }))
        .pipe(gulp.dest('./'))
        .on('end', function() {
            cb()
        });
});
