#!/usr/bin/env node

// each object in the array consists of a key which refers to the source and
// the value which is the destination.
var filestocopy = [{
    "resources/android/notification.png":
    "platforms/android/res/drawable/notification.png"
}];

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
    });
});
