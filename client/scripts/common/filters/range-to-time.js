'use strict';
var filtername = 'rangeToTime';

module.exports = function(app) {

  var deps = [
  	app.name + '.TimeConverter'
  ];

  function filter(TimeConverter) {
    return function(input, date) {
      return TimeConverter.rangeToTime(input, date);
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
