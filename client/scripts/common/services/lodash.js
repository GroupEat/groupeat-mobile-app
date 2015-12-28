'use strict';
var servicename = 'Lodash';

module.exports = function(app) {

  var dependencies = [];

  function service() {
    return require('lodash');
  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
