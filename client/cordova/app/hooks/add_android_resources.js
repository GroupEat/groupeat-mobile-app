#!/usr/bin/env node

// each object in the array consists of a key which refers to the source and
// the value which is the destination.


var fs = require('fs');
var path = require('path');

module.exports = function(ctx) {

  var exportFolders = [
    'drawable-hdpi',
    'drawable-land-hdpi',
    'drawable-land-ldpi',
    'drawable-land-mdpi',
    'drawable-land-xhdpi',
    'drawable-ldpi',
    'drawable-mdpi',
    'drawable-port-hdpi',
    'drawable-port-ldpi',
    'drawable-port-mdpi',
    'drawable-port-xhdpi',
    'drawable-xhdpi'
  ]

  var filesToCopy = [];

  for (var i = 0; i < exportFolders.length; i++) {
    var fileToCopy = {};
    fileToCopy['resources/android/notification.png'] = 'platforms/android/res/' + exportFolders[i] + '/notification.png';
    filesToCopy.push(fileToCopy);
  }

  console.log(filesToCopy);

  var deferral = ctx.requireCordovaModule('q').defer();

  var rootDir = ctx.opts.projectRoot;

  filesToCopy.forEach(function(obj) {
      Object.keys(obj).forEach(function(key) {
        process.stdout.write(key);

          var val = obj[key];
          process.stdout.write(val);

          var srcFile = path.join(rootDir, key);
          var destFile = path.join(rootDir, val);
          var destDir = path.dirname(destFile);
          if (fs.existsSync(srcFile) && fs.existsSync(destDir)) {
              fs.createReadStream(srcFile).pipe(
                 fs.createWriteStream(destFile));
          }
      });
  });

  return deferral.promise;
}
