'use strict';
var controllername = 'CustomerAuthenticationCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$ionicSlideBoxDelegate',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$timeout',
    app.namespace.common + '.ElementModifier',
    app.namespace.common + '.Network',
    app.namespace.common + '.Popup',
  ];

  function controller(_, $ionicSlideBoxDelegate, $rootScope, $scope, $state, $stateParams, $timeout, ElementModifier, Network, Popup) {
    $scope.slideIndex = 0;
    $scope.user = {};
    $scope.isProcessingRequest = false;
    $scope.registering = true;

    $scope.slideHasChanged = function(index) {
      $scope.slideIndex = index;
    };

    $scope.slideTo = function(index) {
      $ionicSlideBoxDelegate.slide(index);
      $scope.slideIndex = index;
    };

    /* Setting the right slideIndex to avoid having to swipe when redirected to auth */
    $timeout(function() {
      $scope.slideTo($stateParams.slideIndex);
    }, 100);

    $scope.submitForm = function(form, registering) {
      if (registering) {
        $scope.submitRegisterForm(form);
      } else {
        $scope.submitLoginForm(form);
      }
    };

    $scope.submitLoginForm = function(form) {
      $scope.isProcessingRequest = true;
      var customerId = null;
      Network.hasConnectivity()
      .then(function() {
        return ElementModifier.validate(form);
      })
      .then(function() {
        return Authentication.authenticate($scope.user);
      })
      .then(function (credentials) {
        $state.go('app.group-orders');
        $rootScope.$broadcast('loginSuccess', credentials, $scope.user.email);
      })
      .catch(function(errorMessage) {
        return Popup.error(errorMessage);
      })
      .finally(function() {
        $scope.isProcessingRequest = false;
      });
    };

    $scope.submitRegisterForm = function(form) {
      $scope.isProcessingRequest = true;
      Network.hasConnectivity()
      .then(function() {
        return ElementModifier.validate(form);
      })
      .then(function() {
        // TODO : Fetch proper locale
        var requestBody = _.merge($scope.user, { 'locale': 'fr' });
        return Customer.save(requestBody);
      })
      .then(function(credentials) {
        $state.go('app.signup');
        $rootScope.$broadcast('registerSuccess', credentials, $scope.user.email);
      })
      .catch(function(errorMessage) {
        Popup.error(errorMessage);
      })
      .finally(function() {
        $scope.isProcessingRequest = false;
      });
    };
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
