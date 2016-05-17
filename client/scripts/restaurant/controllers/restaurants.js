'use strict';
var controllername = 'RestaurantsCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$q',
    '$rootScope',
    '$scope',
    '$state',
    app.namespace.common + '.ControllerPromiseHandler',
    app.namespace.customer + '.CustomerInformationChecker',
    app.namespace.customer + '.CustomerStorage',
    app.namespace.orders + '.GroupOrder',
    app.namespace.common + '.Network',
    app.namespace.orders + '.Order',
    app.name + '.Restaurant'
  ];

  function controller(_, $q, $rootScope, $scope, $state, ControllerPromiseHandler, CustomerInformationChecker, CustomerStorage, GroupOrder, Network, Order, Restaurant) {
    $scope.restaurants = [];

    $scope.onReload = function() {
      var promise = Network.hasConnectivity()
      .then(function() {
        $scope.address = CustomerStorage.getAddress();
        return Restaurant.getFromCoordinates($scope.address.latitude, $scope.address.longitude);
      })
      .then(function(restaurants) {
        $scope.restaurants = restaurants;
        if (_.isEmpty(restaurants)) {
          return $q.reject('noRestaurants');
        }
      });
      ControllerPromiseHandler.handle(promise, $scope.initialState)
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.onRestaurantTouch = function(restaurant) {
      var isOpen;
      Restaurant.getOnlyOpenedFromCoordinates($scope.address.latitude, $scope.address.longitude)
      .then(function(openedRestaurants){
        isOpen = !_.isEmpty(_.find(openedRestaurants, function(openRestaurant){
          return openRestaurant.id == restaurant.id;
        }));
        return CustomerInformationChecker.check();
      })
      .then(function () {
        return GroupOrder.get($scope.address.latitude, $scope.address.longitude);
      })
      .then(function (groupOrders) {
        return Restaurant.checkGroupOrders(restaurant.id, groupOrders);
      })
      .then(function(existingGroupOrder) {
        if (existingGroupOrder) {
          Order.setCurrentOrder(existingGroupOrder.id, existingGroupOrder.endingAt, existingGroupOrder.discountRate, existingGroupOrder.remainingCapacity, existingGroupOrder.restaurant.data.discountPolicy, existingGroupOrder.totalRawPrice);
        }
        else {
          Order.setCurrentOrder(null, null, 0, restaurant.deliveryCapacity, restaurant.discountPolicy, 0, restaurant.closingAt);
        }
        $state.go('app.restaurant-menu', {isRestaurantOpen: isOpen, restaurantId: restaurant.id});
      });
    };

    $scope.back = function() {
      $state.go('app.group-orders');
    };

    $scope.$on('$ionicView.afterEnter', function() {
      $scope.initialState = $state.current.name;
      $scope.onReload();
    });
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
