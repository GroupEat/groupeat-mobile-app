'use strict';

var directivename = 'geOrderCard';

module.exports = function(app) {

  var directiveDeps = [
    '$document'
  ];

  var directive = function($document) {
    return {
      restrict: 'EA',
      link: function(scope, element) {
        var top = element[0].querySelector('.top');
        if (top) {
          top.style.height = $(document).height() - 380 + 'px';
        }
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
