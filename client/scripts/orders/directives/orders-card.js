'use strict';

var directivename = 'geOrdersCard';

module.exports = function(app) {

  var directiveDeps = [];

  var directive = function() {
    return {
      restrict: 'EA',
      template: require('./orders-card.html'),
      scope: {
        order: '=',
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
