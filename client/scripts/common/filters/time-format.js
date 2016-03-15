'use strict';
var filtername = 'timeFormat';

module.exports = function(app) {

  var deps = [
  'amMoment'
  ];

  function filter() {
    return function(input) {
      return moment(input).format('H') + 'h' + moment(input).format('mm');
    };
  }

  filter.$inject = deps;
  app.filter(filtername, filter);
};
