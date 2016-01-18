'use strict';

var directivename = 'geTimer';

module.exports = function(app) {

  var directiveDeps = [];

  var directive = function() {
    return {
      restrict: 'E',
      template: require('./timer.html'),
      scope: {
        endTime: '@',
        callbackTimer: '='
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
