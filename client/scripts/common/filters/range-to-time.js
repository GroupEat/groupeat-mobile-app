'use strict';
var filtername = 'rangeToTime';

module.exports = function(app) {

  var deps = [
  ];

  function filter(date) {
    return function(input, date) {
      return moment(date).set({'hour': (input - (input % 100)) / 100, 'minute': input % 100 * 30/50});
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
