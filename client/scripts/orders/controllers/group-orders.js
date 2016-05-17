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
    app.namespace.customer + '.CustomerInformationChecker',
    app.namespace.customer + '.CustomerStorage',
    app.name + '.GroupOrder',
    app.namespace.common + '.Network',
    app.name + '.Order'
  ];

  function controller(_, $ionicPlatform, $rootScope, $scope, $state, $q, ControllerPromiseHandler, CustomerInformationChecker, CustomerStorage, GroupOrder, Network, Order) {
    $scope.groupOrders = [];

    $scope.onReload = function() {
      var promise = Network.hasConnectivity()
      .then(function() {
        var address = CustomerStorage.getAddress();
        return GroupOrder.getFromAddress(address);
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
      CustomerInformationChecker.check()
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
      if ($scope.initialState === 'app.group-orders') {
        $scope.onReload();
      }
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
