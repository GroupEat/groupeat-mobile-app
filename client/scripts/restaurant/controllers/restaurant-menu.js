'use strict';
var controllername = 'RestaurantMenuCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$filter',
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
    app.namespace.common + '.Scroller'
  ];

  function controller(_, $filter, $ionicModal, $q, $scope, $state, $stateParams, $timeout, Cart, ControllerPromiseHandler, Network, Order, Popup, Product, Restaurant, Scroller) {
    var $timeFormat = $filter('timeFormat');
    $scope.shownGroup = [];
    $scope.isNewOrder = {
      value: null
    };
    $scope.foodRushTime = {};
    $scope.preOrderTime = {};
    $scope.isRestaurantOpen = $stateParams.isRestaurantOpen;
    
    $scope.onReload = function() {
      $scope.currentOrder = Order.getCurrentOrder();
      $scope.foodRushTime.value = $scope.currentOrder.foodRushMax/2 + ($scope.currentOrder.foodRushMax%10)/2;
      $scope.preOrderTime.range = 0;
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
        $scope.setRangeMinMax()
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
        $state.go('app.group-orders');
      }
      else {
        Popup.confirm('leaveOrder', 'cartWillBeDestroyed')
        .then(function(res) {
          if(res) {
            Cart.reset();
            Order.resetCurrentOrder();
            $state.go('app.group-orders');
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
        Order.setPreOrderTime(moment($scope.rangeToTime($scope.preOrderTime.range)).format("YYYY[-]MM[-]DD HH[:]mm[:]ss"));
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
        $state.go('app.group-orders');
      });
    };

    $scope.timeToRange = function (time) {
      return moment(time).format('H') * 100 + moment(time).format('mm') * 50/30;
    };

    $scope.rangeToTime = function(range) {
      return moment($scope.restaurant.openingWindows.data[0].start).set({'hour': (range - (range % 100)) / 100, 'minute': range % 100 * 30/50}); 
    };

    $scope.setRangeMinMax = function() {
      var minRange = $scope.timeToRange($scope.restaurant.openingWindows.data[0].start);
      minRange = minRange + (50 - minRange % 50);
      document.getElementById(1).max = $scope.timeToRange($scope.restaurant.openingWindows.data[0].end);
      document.getElementById(1).min = minRange;
      $scope.preOrderTime.range = minRange;
    }

    $scope.$on('$ionicView.afterEnter', function() {
      $scope.initialState = $state.current.name;
      $scope.onReload();
    });
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
