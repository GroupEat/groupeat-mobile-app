'use strict';
var controllername = 'GroupOrdersCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$ionicPlatform',
    '$rootScope',
    '$scope',
    '$state',
    '$q',
    app.namespace.common + '.ControllerPromiseHandler',
    app.namespace.customer + '.Customer',
    app.namespace.customer + '.CustomerInformationChecker',
    app.namespace.common + '.Geolocation',
    app.name + '.GroupOrder',
    app.namespace.common + '.Network',
    app.name + '.Order'
  ];

  function controller(_, $ionicPlatform, $rootScope, $scope, $state, $q, ControllerPromiseHandler, Customer, CustomerInformationChecker, Geolocation, GroupOrder, Network, Order) {
    $scope.groupOrders = [];

    $scope.onReload = function() {
      var promise = Network.hasConnectivity()
      .then(function() {
        return Geolocation.getGeolocation();
      })
      .then(function(currentPosition) {
        $scope.userCurrentPosition = currentPosition;
        return GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude);
      })
      .then(function(groupOrders) {
        $scope.groupOrders = groupOrders;
        if (_.isEmpty(groupOrders)) {
          return $q.reject('noGroupOrders');
        }
      });
      ControllerPromiseHandler.handle(promise, $scope.initialState)
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.onJoinOrderTouch = function(groupOrder) {
      Customer.checkActivatedAccount()
      .then(function() {
        return CustomerInformationChecker.check();
      })
      .then(function() {
        Order.setCurrentOrder(groupOrder.id, groupOrder.endingAt, groupOrder.discountRate, groupOrder.remainingCapacity, groupOrder.restaurant.data.discountPolicy, groupOrder.totalRawPrice);
        $state.go('app.restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
      });
    };

    $scope.setArrayFromInt = function (num) {
      return new Array(num);
    };

    $scope.$on('$ionicView.afterEnter', function() {
      $scope.initialState = $state.current.name;
      $scope.onReload();
    });

    var deregister = $ionicPlatform.on('resume', function() {
      $scope.initialState = $state.current.name;
      $scope.onReload();
    });

    $scope.$on('$destroy', deregister);

    $scope.callbackTimer = {};
    $scope.callbackTimer.finished = function() {
      $scope.onReload();
    };
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
