'use strict';
var controllername = 'SettingsCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$q',
    '$scope',
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

  function controller(_, $q, $scope, Authentication, Credentials, Customer, CustomerSettings, CustomerStorage, ElementModifier, IonicUser, Network, PhoneFormat, Popup) {
    /*
    Models
    */
    $scope.customerIdentity = {};
    $scope.customerSettings = {};
    $scope.form = {};
    $scope.isProcessingRequest = false;

    $scope.onReload = function() {
      $scope.isProcessingRequest = true;
      $scope.customerIdentity = CustomerStorage.getIdentity();
      $scope.customerSettings = CustomerStorage.getSettings();
      $scope.isProcessingRequest = false;
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
          return ElementModifier.validate($scope.form.settings);
        })
        .then(function() {
          var authenticationParams = _.pick($scope.customerIdentity, ['email', 'oldPassword', 'newPassword']);
          var promises = [
            Customer.update(customerId, _.clone($scope.customerIdentity)),
            Authentication.updatePassword(authenticationParams),
            CustomerSettings.update(customerId, $scope.customerSettings)
          ];
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
      $scope.onReload();
    });
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
