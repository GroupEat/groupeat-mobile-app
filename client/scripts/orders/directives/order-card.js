'use strict';

var directivename = 'geOrderCard';

module.exports = function(app) {

  var directiveDeps = [
    '$document'
  ];

  var directive = function($document) {
    return {
      restrict: 'EA',
      template: require('./order-card.html'),
      link: function(scope, element) {
        var top = element[0].querySelector('.top');
        top.style.height = $document.height() - 380 + 'px';
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
