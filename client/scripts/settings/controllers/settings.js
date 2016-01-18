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
        Network.hasConnectivity()
        .then(function() {
          return ElementModifier.validate($scope.form.customerEdit);
        })
        .then(function() {
          var authenticationParams = _.pick($scope.customerIdentity, ['email', 'oldPassword', 'newPassword']);
          var promises = [
            Customer.update(customerId, $scope.customerIdentity),
            Authentication.updatePassword(authenticationParams),
            CustomerSettings.update(customerId, $scope.customerSettings)
          ];
          var addressParams = Address.getAddressFromResidencyInformation($scope.customerAddress.residency);
          if (addressParams)
          {
            addressParams = _.merge(addressParams, {details: $scope.customerAddress.details});
            promises.push(Address.update(customerId, addressParams));
          }
          return $q.all(promises);
        })
        .then(function(data) {
          $scope.oldPassword = '';
          $scope.newPassword = '';
          var customer = data[0];
          customer.phoneNumber = PhoneFormat.formatPhoneNumberForFrontend(customer.phoneNumber);
          $scope.customerIdentity = customer;
          IonicUser.set(_.omit(customer, ['activated']));
          CustomerStorage.setIdentity(customer);
          IonicUser.set(data[2]);
          CustomerStorage.setSettings(data[2]);
          if (data.length === 4) {
            IonicUser.set(data[3]);
            CustomerStorage.setAddress(data[3]);
          }
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
