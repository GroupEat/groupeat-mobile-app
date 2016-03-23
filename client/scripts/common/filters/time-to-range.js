'use strict';
var filtername = 'timeToRange';

module.exports = function(app) {

  var deps = [
  ];

  function filter() {
    return function(input) {
      return moment(input).format('H') * 100 + moment(input).format('mm') * 50/30;
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
