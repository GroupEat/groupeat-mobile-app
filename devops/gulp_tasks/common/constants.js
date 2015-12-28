'use strict';

var path = require('path');

var getRepository = function() {
    var repository = 'git@github.com:GroupEat/groupeat-hybrid-mobile.git';
    try {
        var helper = require('./helper');
        var packageJson = helper.readJsonFile('./package.json');
        var _ = require('lodash');
        if (_.isString(packageJson.repository)) {
            repository = packageJson.repository.replace('.git', '');
        } else {
            repository = packageJson.repository.url.replace('.git', '');
        }
    } catch(err) {}
    return repository;
};

var getAppname = function() {
    var appname;
    try {
        var helper = require('./helper');
        var packageJson = helper.readJsonFile('./package.json');
        appname = packageJson.name;
    } catch(err) {}
    return appname;
};

var getBrowserOption = function() {
  for(var i = 0; i < process.argv.length; i++){
    var matches = process.argv[i].match(new RegExp("^--browser=(.*)$"));
    if(matches){
      return [matches[1]];
    }
  }
}

module.exports = function() {
    var cwd = process.env.INIT_CWD || '';
    var clientFolder = 'client'; // the source file folder
    var defaultTarget = 'app'; // the name of the app that corresponds to index.html
    var constants = {
        cwd: cwd,
        maxBuffer: 1024 * 5000,
        appname: getAppname(),
        defaultTarget: defaultTarget,
        clientFolder: clientFolder,
        repository: getRepository(),
        versionFiles: ['./package.json', './bower.json', './' + clientFolder + '/config*.xml'],
        growly: {
            notify: false,
            successIcon: path.join(cwd, 'node_modules/karma-growl-reporter/images/success.png'),
            failedIcon: path.join(cwd, 'node_modules/karma-growl-reporter/images/failed.png')
        },
        cordova: {
            src: './' + clientFolder + '/cordova/app',
            icon: './' + clientFolder + '/icons/app/icon.png',
            splash: './' + clientFolder + '/icons/app/splash.png',
            platform: 'ios',
            iconBackground: '#fff'
        },
        fonts: {
            src: ['./' + clientFolder + '/fonts/*.*', './' + clientFolder + '/fonts/app/**/*.*', './node_modules/ionic-sdk/release/fonts/*.*', './node_modules/font-awesome/fonts/*.*', './node_modules/bootstrap/dist/fonts/*.*'], // you can also add a specific src_appname
            dest: 'fonts'
        },
        html: {
            src: './' + clientFolder + '/index.html'
        },
        images: {
            src: [
                './' + clientFolder + '/images/**/*', './' + clientFolder + '/images/*.*',
                './' + clientFolder + '/icons/**/*', './' + clientFolder + '/icons/*.*'
            ]
        },
        style: {
            watchFolder: ['./' + clientFolder + '/styles/**/*.scss', './' + clientFolder + '/styles/**/*.less'],
            dest: 'styles',
            destName: 'main.css',
            css: {
              src: [
                './bower_components/ng-walkthrough/css/ng-walkthrough.css'
              ]
            },
            sass: {
                src: ['./' + clientFolder + '/styles/main.scss']
            },
            less: {
                src: ['./' + clientFolder + '/styles/main.less']
            }
        },
        script: {
            dest: 'scripts'
        },
        webpack: {
            src: './main.js'
        },
        exorcist: {
            dest: 'srcmaps',
            mapExtension: '.map.js'
        },
        ionic: {
            app: {
                app_id: 'd1f6e877',
                api_key: 'a50a33809f344de407b835f9f31f36e3c1b717abb4bd8461',
                name: 'GroupEat'
            }
        },
        serve: {
            host: 'localhost', //'0.0.0.0',
            port: 5000,
            open: true,
            browser: getBrowserOption() || ['google chrome'], // ['google chrome', 'firefox'],
            localtunnel: false,
            ghostMode: {
                clicks: false,
                forms: false,
                scroll: false
            }
        },
        mocha: {
            libs: ['server/**/*.js'],
            tests: ['test/mocha/**/*.js'],
            globals: 'test/mocha/helpers/globals.js',
            timeout: 5000
        },
        e2e: {
            src: ['./test/e2e/**/*test.js'],
            port: 5555,
            configFile: 'protractor.conf.js'
        },
        deployFolder: './dist/app/prod/deploy',
        distFolders: {
          local: './dist/app/dev',
          dev: './dist/app/dev',
          staging: './dist/app/prod',
          prod: './dist/app/prod'
        },
        bundleName: 'bundle.js',
        moduleManager: 'webpack'
    };

    return constants;
};
