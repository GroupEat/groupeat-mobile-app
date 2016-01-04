'use strict';
var controllername = 'SettingsCtrl';

require('../views/settings-profile.html');
require('../views/settings-notifications.html');

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$ionicSlideBoxDelegate',
    '$q',
    '$rootScope',
    '$scope',
    '$state',
    app.namespace.customer + '.Address',
    app.namespace.authentication + '.Authentication',
    app.namespace.authentication + '.Credentials',
    app.namespace.customer + '.Customer',
    app.namespace.customer + '.CustomerSettings',
    app.namespace.customer + '.CustomerStorage',
    app.namespace.common + '.ElementModifier',
    app.namespace.customer + '.IonicUser',
    app.namespace.common + '.Network',
    app.namespace.customer + '.PhoneFormat',
    app.namespace.common + '.Popup',
  ];

  function controller(_, $ionicSlideBoxDelegate, $q, $rootScope, $scope, $state, Address, Authentication, Credentials, Customer, CustomerSettings, CustomerStorage, ElementModifier, IonicUser, Network, PhoneFormat, Popup) {
    /*
    Models
    */
    $scope.customerIdentity = {};
    $scope.customerAddress = {};
    $scope.customerSettings = {};
    $scope.form = {};
    $scope.isProcessingRequest = false;

    /*
    Settings list
    */
    $scope.slideIndex = 0;
    $scope.tabs = [
      {
        id: 0,
        title: 'editProfile',
        url: 'settings-profile.html'
      },
      {
        id: 1,
        title: 'pushSettings',
        url: 'settings-notifications.html'
      }
    ];

    $scope.onReload = function() {
      $scope.isProcessingRequest = true;
      $scope.customerIdentity = CustomerStorage.getIdentity();
      $scope.customerAddress = CustomerStorage.getAddress();
      $scope.customerSettings = CustomerStorage.getSettings();
      $scope.isProcessingRequest = false;
    };

    /*
    Switching tab
    */
    $scope.slideTo = function(slideId) {
      $ionicSlideBoxDelegate.slide(slideId);
      $scope.slideIndex = slideId;
    };

    /*
    Saving
    */
    $scope.onSave = function() {
      if (!$scope.isProcessingRequest) {
        $scope.isProcessingRequest = true;
        var customerId = Credentials.get().id;

        // TODO : make request only if changes have been made
        Network.hasConnectivity()
        .then(function() {
          return ElementModifier.validate($scope.form.customerEdit);
        })
        .then(function() {
          return Customer.update(customerId, $scope.customerIdentity);
        })
        .then(function(customer) {
          customer.phoneNumber = PhoneFormat.formatPhoneNumberForFrontend(customer.phoneNumber);
          $scope.customerIdentity = customer;
          IonicUser.set(_.omit(customer, ['activated']));
          CustomerStorage.setIdentity(customer);
          var addressParams = Address.getAddressFromResidencyInformation($scope.customerAddress.residency);
          if (!addressParams)
          {
            // If no residency was provided, not requesting the Address update
            return $q.when({});
          }
          addressParams = _.merge(addressParams, {details: $scope.customerAddress.details});
          return Address.update(customerId, addressParams);
        })
        .then(function(address) {
          IonicUser.set(address);
          CustomerStorage.setAddress(address);
          var authenticationParams = _.pick($scope.customerIdentity, ['email', 'oldPassword', 'newPassword']);
          return Authentication.updatePassword(authenticationParams);
        })
        .then(function() {
          // Clearing both passwords
          $scope.oldPassword = '';
          $scope.newPassword = '';
          return CustomerSettings.update(customerId, $scope.customerSettings);
        })
        .then(function(customerSettings) {
          IonicUser.set(customerSettings);
          CustomerStorage.setSettings(customerSettings);
          $scope.isProcessingRequest = false;
          return Popup.title('customerEdited');
        })
        .catch(function(errorMessage) {
          Popup.error(errorMessage)
          .then(function() {
            $scope.isProcessingRequest = false;
          });
        });
      }
    };

    $scope.$on('$ionicView.afterEnter', function() {
      $scope.daysWithoutNotifyingOptions = CustomerSettings.getDaysWithoutNotifying();
      $scope.noNotificationAfterOptions = CustomerSettings.getNoNotificationAfterHours();
      $scope.residencies = Address.getResidencies();
      $scope.onReload();
    });
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
