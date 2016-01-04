'use strict';
var controllername = 'SignupCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$ionicSlideBoxDelegate',
    '$rootScope',
    '$scope',
    '$state',
    app.name + '.Address',
    app.namespace.authentication + '.Credentials',
    app.name + '.Customer',
    app.name + '.CustomerStorage',
    app.name + '.IonicUser',
    app.namespace.common + '.Network',
    app.namespace.common + '.Popup'
  ];

  function controller(_, $ionicSlideBoxDelegate, $rootScope, $scope, $state, Address, Credentials, Customer, CustomerStorage, IonicUser, Network, Popup) {
    $scope.slideIndex = 0;
    $scope.user = {};
    $scope.residencies = Address.getResidencies();

    $scope.slideTo = function(index) {
      $ionicSlideBoxDelegate.slide(index);
      $scope.slideIndex = index;
    };

    $scope.confirmSignup = function() {
      Network.hasConnectivity()
      .then(function() {
        var customerId = Credentials.get().id;
        var customerParams = _.pick($scope.user, ['firstName', 'lastName', 'phoneNumber']);
        return Customer.update(customerId, customerParams);
      })
      .then(function(customer) {
        IonicUser.set(_.omit(customer, ['activated']));
        CustomerStorage.setIdentity(customer);
        var addressParams = _.merge(Address.getAddressFromResidencyInformation($scope.user.residency), {details: $scope.user.addressSupplement});
        return Address.update(customer.id, addressParams);
      })
      .then(function(address) {
        IonicUser.set(address);
        CustomerStorage.setAddress(address);
        $scope.hasSignedUp();
      })
      .catch(function(errorMessage) {
        Popup.error(errorMessage);
      });
    };

    $scope.hasSignedUp = function() {
      Popup.alert('welcome', 'welcomeDetails')
      .then(function(){
        $rootScope.$broadcast('deviceRegisterStart');
        $state.go('app.group-orders');
      })
      .catch(function(errorMessage){
        return Popup.error(errorMessage);
      });
    };
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
