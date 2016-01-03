'use strict';

var directivename = 'geRestaurantCard';

module.exports = function(app) {

  var directiveDeps = [
    '$rootScope',
    '$state'
  ];

  var directive = function($rootScope, $state) {
    return {
      restrict: 'EA',
      template: require('./restaurant-card.html'),
      scope: {
        data: '='
      },
      link: function(scope) {
        var rating = scope.data.rating;

        scope.setArrayFromInt = function (num) {
          return new Array(num);
        };

        scope.starClass = function(index) {
          if (index < Math.floor(rating / 2)) {
            return 'icon ion-ios-star';
          } else if (index === Math.floor(rating / 2) && rating % 2 === 1){
            return 'icon ion-ios-star-half';
          }
          return 'icon ion-ios-star-outline';
        };
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
