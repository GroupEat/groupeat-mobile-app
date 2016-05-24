'use strict';
var controllername = 'CartCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    '$ionicHistory',
    '$ionicSlideBoxDelegate',
    '$scope',
    '$state',
    app.namespace.customer + '.Address',
    app.name + '.Cart',
    app.namespace.customer + '.CustomerStorage',
    app.name + '.Order',
    app.name + '.PredefinedAddresses',
    app.namespace.common + '.Popup'
  ];

  function controller($ionicHistory, $ionicSlideBoxDelegate, $scope, $state, Address, Cart, CustomerStorage, Order, PredefinedAddresses, Popup) {
    $scope.$on('modal.shown', function() {
      $scope.cart = Cart;
      $scope.comment = {value : ''};
      $scope.currentDiscount = Order.getCurrentDiscount();
      $scope.foodRushTime.value = Order.getFoodRushTime() || 0 ;
      PredefinedAddresses.get()
      .then(function(predifinedAddresses) {
        $scope.predifinedAddresses = predifinedAddresses;
      });
      $scope.address = CustomerStorage.getAddress();
    });

    $scope.slideIndex = 0;

    $scope.isRequesting = false;

    $scope.confirmButtons = [
      {title: 'Valider ma commande !', color: 'green'},
      {title: 'Valider mon adresse !', color: 'orange'}
    ];

    $scope.addressMode = {
      name: 'preset',
      other: 0
    };

    $scope.activeButton = $scope.confirmButtons[0];

    $scope.slideHasChanged = function(index) {
      $scope.slideIndex = index;
      $scope.activeButton = $scope.confirmButtons[index];
    };

    $scope.closeCart = function() {
      $scope.modal.hide()
      .then(function() {
        $ionicSlideBoxDelegate.slide(0);
      });
    };

    $scope.confirmButtonAction = function() {
      if($scope.slideIndex === 0) {
        $ionicSlideBoxDelegate.slide(1);
      } else {
        if(!$scope.isRequesting) {
          $scope.isRequesting = true;
          var address = ($scope.addressMode.name === 'preset') ? $scope.address : $scope.predifinedAddresses[$scope.addressMode.other];
          Order.setDeliveryAddress(address);
          Order.setComment($scope.comment.value);
          var requestProducts = {};
          angular.forEach(Cart.getProducts(), function(product) {
            requestProducts[product.id] = product.quantity;
          });
          Order.setProductFormats(requestProducts);
          Order.save()
          .then(function() {
            $scope.isRequesting = false;
            $scope.leaveOrder();
            Popup.alert('successfulOrder', 'yourOrderIsSuccessful');
          })
          .catch(function (errorResponse) {
            $scope.isRequesting = false;
            Popup.confirm('whoops', errorResponse, 'exitOrder', 'cancel')
            .then(function(leaveOrder) {
              if(leaveOrder) {
                $scope.leaveOrder();
              }
            });
          });
        }
      }
    };

    $scope.leaveOrder = function() {
      $scope.modal.hide();
      $ionicSlideBoxDelegate.slide(0);
      Order.resetCurrentOrder();
      Cart.reset();
      $state.go('app.group-orders');
    };
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
