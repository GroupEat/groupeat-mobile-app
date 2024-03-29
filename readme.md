# GroupEat Mobile App

[![NPM version](https://badge.fury.io/js/groupeat_mobile_app.svg)](http://badge.fury.io/js/groupeat_mobile_app) [![Downloads](http://img.shields.io/npm/dm/groupeat_mobile_app.svg)](http://badge.fury.io/js/groupeat_mobile_app)   
[![Circle CI](https://circleci.com/gh/GroupEat/groupeat-mobile-app/tree/staging.svg?style=svg&circle-token=eb5f842bba1670dd99e7edbeb39cfcc2a4f9b752)](https://circleci.com/gh/GroupEat/groupeat-mobile-app/tree/staging) [![Test Coverage](https://codeclimate.com/repos/56c8e2524fd7b65d3c01dbc7/badges/ee8c634e07f255bec3cd/coverage.svg)](https://codeclimate.com/repos/56c8e2524fd7b65d3c01dbc7/coverage) [![Code Climate](https://codeclimate.com/repos/56c8e2524fd7b65d3c01dbc7/badges/ee8c634e07f255bec3cd/gpa.svg)](https://codeclimate.com/repos/56c8e2524fd7b65d3c01dbc7/feed) 

## Installation

You first need to clone the project
```
git clone git@github.com:GroupEat/groupeat-mobile-app.git && cd groupeat-mobile-app
```

You can then run the following script which installs a couple of global npm packages. You may need to add sudo before the command.

The dependencies work with node v0.12.4, you can switch versions if needed using nvm (install it first)

```
nvm install 0.12.4
nvm use 0.12.4
```

```
./bin/prepublish.sh
```

Install the local npm packages with

```
bower install
npm install
```

## Running

```
gulp browsersync
```

## Testing

```
gulp test
```

If you want to keep the tests running, you can use

```
gulp test --watch
```

## Deployment

### Ionic Package Deploy

A validated feature should be accompanied with a commited bump which can be generated with.

```
gulp bump
```

A production deployment should be accompanied with a commited bump which can be generated with

```
gulp bump --minor
```

You can use the following command to request the compiling of the applications by ionic package.
You will get the two ids of the builds to fetch.

```
gulp compile --env=staging
```

You can also compile only for a platform using the --platform flag

```
gulp compile --env=staging --platform ios
```

You can then check the status of your build :
```
ionic package list
```

You can then directly download and then upload the files to the server using the following command (where x and y are the ids mentionned above)

```
gulp deploy --id x --id y --env=staging
```

Don't forget to commit the bump.

### Ionic Deploy only deploy

To deploy using only ionic deploy, simply run :

```
gulp soft-deploy --env=staging
```

This method will *not* work with binary modifications (ex. new cordova plugins), and might break. Please refer to the regular deployment method when that happens. It is however usable for the prod application.

### Mac only Deploy

## Generate the mobile applications

```
gulp compile:local --env=prod
```

Run the following command

```
gulp deploy:local --env=prod
```
