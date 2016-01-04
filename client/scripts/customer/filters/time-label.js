'use strict';
var filtername = 'timeLabel';

module.exports = function(app) {

  var deps = [
    app.name + '.CustomerSettings'
  ];

  function filter(CustomerSettings) {
    return function(input) {
      return CustomerSettings.getLabelHourFromValue(input);
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
