'use strict';
var angular = require('angular');
require('ionic');
require('ionic-angular');

var modulename = 'address';

module.exports = function(namespace) {

  var common = require('../common')(namespace);
  var customer = require('../customer')(namespace);

  var fullname = namespace + '.' + modulename;

  var app = angular.module(fullname, [
    'ionic',
    common.name,
    customer.name
  ]);

  app.namespace = app.namespace || {};
  app.namespace.common = common.name;
  app.namespace.customer = customer.name;

  // inject:folders start
  require('./constants')(app);
  require('./directives')(app);
  require('./services')(app);
  // inject:folders end
  require('./run')(app);

  return app;
};
