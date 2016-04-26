'use strict';
var controllername = 'RestaurantMenuCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$ionicHistory',
    '$ionicModal',
    '$q',
    '$scope',
    '$state',
    '$stateParams',
    '$timeout',
    app.namespace.orders + '.Cart',
    app.namespace.common + '.ControllerPromiseHandler',
    app.namespace.common + '.Network',
    app.namespace.orders + '.Order',
    app.namespace.common + '.Popup',
    app.name + '.Product',
    app.name + '.Restaurant',
    app.namespace.common + '.Scroller',
    app.namespace.common + '.TimeConverter'
  ];

  function controller(_, $ionicHistory, $ionicModal, $q, $scope, $state, $stateParams, $timeout, Cart, ControllerPromiseHandler, Network, Order, Popup, Product, Restaurant, Scroller, TimeConverter) {
    $scope.shownGroup = [];
    $scope.isNewOrder = {
      value: null
    };
    $scope.foodRushTime = {};
    $scope.endingAt = {};
    $scope.isRestaurantOpen = $stateParams.isRestaurantOpen;

    $scope.onReload = function() {
      $scope.currentOrder = Order.getCurrentOrder();
      $scope.foodRushTime.value = $scope.currentOrder.foodRushMax/2 + ($scope.currentOrder.foodRushMax%10)/2;
      $scope.endingAt.range = 0;
      $scope.detailedProduct = null;
      Cart.setDiscountRate($scope.currentOrder.currentDiscount);
      $scope.cart = Cart;
      $scope.isNewOrder.value = Order.isNewOrder();

      var promise = Network.hasConnectivity()
      .then(function() {
        return Restaurant.get($stateParams.restaurantId);
      })
      .then(function(restaurant) {
        $scope.restaurant = restaurant;
        if ($scope.isNewOrder.value && !$scope.isRestaurantOpen) {
          $scope.setRangeMinMax();
        }
        return Product.get($stateParams.restaurantId);
      })
      .then(function(products) {
        if (_.isEmpty(products)) {
          return $q.reject('emptyMenu');
        } else {
          $scope.products = products;
        }
      });
      ControllerPromiseHandler.handle(promise, $scope.initialState)
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.toggleDetails = function(product) {
      $scope.detailedProduct = $scope.areDetailsShown(product) ? null : product;
    };

    $scope.areDetailsShown = function(product) {
      return $scope.detailedProduct === product;
    };

    $scope.onDeleteProduct = function(product, format) {
      Cart.removeProduct(product, format);
      Order.updateCurrentDiscount($scope.cart.getTotalPrice());
    };

    $scope.onAddProduct = function(product, format) {
      if ($scope.cart.getTotalQuantity() >= $scope.currentOrder.remainingCapacity) {
        Popup.error('tooManyProducts');
      } else {
        Cart.addProduct(product, format);
        Order.updateCurrentDiscount($scope.cart.getTotalPrice());
      }
    };

    $scope.onLeaveRestaurant = function() {
      if (_.isEmpty($scope.cart.getProducts())) {
        Order.resetCurrentOrder();
        $ionicHistory.goBack();
      }
      else {
        Popup.confirm('leaveOrder', 'cartWillBeDestroyed')
        .then(function(res) {
          if(res) {
            Cart.reset();
            Order.resetCurrentOrder();
            $ionicHistory.goBack();
          }
        });
      }
    };

    $scope.getTimeDiff = function (endingAt) {
      return Order.getTimeDiff(endingAt);
    };

    $scope.getDiscountPrice = function() {
      return $scope.cart.getTotalPrice() * (1 - Order.getCurrentDiscount()/100);
    };

    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
        $timeout(function() {
          Scroller.scrollTo('restaurantMenu', 'product-' + $scope.shownGroup.id);
        }, 300);
      }
    };

    $scope.isGroupShown = function(group) {
      return group === $scope.shownGroup;
    };

    $scope.modal = $ionicModal.fromTemplate(require('../../orders/views/cart.html'), {
      scope: $scope,
      animation: 'slide-in-up'
    });

    $scope.isProductSelected = function(product) {
      return _.find($scope.cart.getProducts(), 'name', product.name);
    };

    $scope.openCart = function() {
      if($scope.restaurant.isOpened)
        Order.setFoodRushTime($scope.foodRushTime.value);
      else
        Order.setEndingAt(moment(TimeConverter.rangeToTime($scope.endingAt.range, $scope.restaurant.openingWindows.data[0].start)).format("YYYY[-]MM[-]DD HH[:]mm[:]ss"));
      $scope.modal.show();
    };

    $scope.isDiscountToShow = function () {
      return $scope.currentOrder && ($scope.currentOrder.currentDiscount || $scope.currentOrder.groupOrderDiscount) && $scope.cart.getTotalPrice();
    };

    $scope.callbackTimer = function() {
      Popup.alert('foodRushIsOver', 'tooLateToOrder')
      .then(function() {
        Cart.reset();
        Order.resetCurrentOrder();
        if($scope.modal.isShown())
        {
          $scope.closeCart();
        }
        $ionicHistory.goBack();
      });
    };

    $scope.setRangeMinMax = function() {
      var minRange = TimeConverter.timeToRange($scope.restaurant.openingWindows.data[0].start);
      var halfRange = 50;
      minRange = minRange + minRange % halfRange;
      if (minRange % halfRange !== 0) {
        minRange = minRange - halfRange;
      }
      document.getElementById(1).max = TimeConverter.timeToRange($scope.restaurant.openingWindows.data[0].end);
      document.getElementById(1).min = minRange;
      $scope.endingAt.range = minRange;
    };

    $scope.$on('$ionicView.afterEnter', function() {
      $scope.initialState = $state.current.name;
      $scope.onReload();
    });
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
