'use strict';
// this file is used by webpack to create a bundle of all unit tests and then is passed to karma
var _ = require('lodash');
var testsContext = require.context('.', true, /.+\.test\.js?$/);
var keys = testsContext.keys();
keys = _.filter(keys, function(key) {
    return !/groupeat.*\.test\.js/i.test(key);
});

keys.forEach(testsContext);

angular.module("ngConstants", [])

.constant("apiEndpoint", "")

.constant("ionicDeployChannel", "")

;
