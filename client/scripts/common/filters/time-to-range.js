'use strict';
var filtername = 'timeToRange';

module.exports = function(app) {

  var deps = [
  	app.name + '.TimeConverter'
  ];

  function filter(TimeConverter) {
    return function(input) {
      return TimeConverter.timeToRange(input);
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
