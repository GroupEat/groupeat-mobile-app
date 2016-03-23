'use strict';
var servicename = 'TimeConverter';

module.exports = function(app) {

  var dependencies = [
  ];

  function service() {

    var timeToRange = function(date) {
      return moment(date).format('H') * 100 + moment(date).format('mm') * 50/30;
    },

    var rangeToTime = function(range, date) {
      return moment(date).set({'hour': (range - (range % 100)) / 100, 'minute': range % 100 * 30/50});
    };

    return {
      timeToRange: timeToRange,
      rangeToTime: rangeToTime
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
