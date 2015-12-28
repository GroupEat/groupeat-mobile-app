'use strict';

var directivename = 'geMessageBackdrop';

module.exports = function(app) {

  var directiveDeps = [
    '$rootScope',
    '$state'
  ];

  var directive = function($rootScope, $state) {
    return {
      restrict: 'EA',
      template: require('./message-backdrop.html'),
      scope: {
        status: '=',
        icon: '=',
        title: '=',
        details: '=',
        buttonText: '=',
        buttonSref: '='
      },
      link: function(scope) {
        scope.isLoading = function() {
          return scope.status === 'loading';
        };
        scope.isDisplayed = function() {
          return scope.status === 'displayed';
        };
        scope.buttonAction = function() {
          if(scope.buttonSref) {
            $state.go(scope.buttonSref);
          } else {
            $state.reload();
            $rootScope.$broadcast('$ionicView.afterEnter');
          }
        };
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
