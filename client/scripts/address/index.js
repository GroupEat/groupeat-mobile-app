'use strict';
var angular = require('angular');
require('ionic');
require('ionic-angular');

var modulename = 'address';

module.exports = function(namespace) {

  var customer = require('../customer')(namespace);

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'ionic',
    customer.name
  ]);

  app.namespace = app.namespace || {};
  app.namespace.customer = customer.name;

  // inject:folders start
  require('./directives')(app);
  require('./services')(app);
  // inject:folders end

  return app;
};
