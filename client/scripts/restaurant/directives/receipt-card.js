'use strict';

var directivename = 'geReceiptCard';

module.exports = function(app) {

  var directiveDeps = [];

  var directive = function() {
    return {
      restrict: 'EA',
      template: require('./receipt-card.html'),
      scope: {
        orders: '=',
        restaurant: '=',
        discount: '=',
        hideComment: '=?',
        comment: '='
      },
      link: function(scope) {
        scope.setArrayFromInt = function (num) {
          return new Array(num);
        };
        scope.date = new Date();
        scope.$watch('discount', function() {
          scope.realPrice = scope.orders.getTotalPrice() * ( (100 - scope.discount ) / 100 );
        });
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};