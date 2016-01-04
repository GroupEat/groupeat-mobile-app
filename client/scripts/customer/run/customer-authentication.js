'use strict';

module.exports = function(app) {

  var dependencies = [
    '$rootScope',
    app.name + '.Address',
    app.namespace.authentication + '.Credentials',
    app.name + '.Customer',
    app.name + '.CustomerSettings',
    app.name + '.CustomerStorage',
    app.name + '.IonicUser',
    app.namespace.common + '.Popup'
  ];

  function run($rootScope, Address, Credentials, Customer, CustomerSettings, CustomerStorage, IonicUser, Popup) {
    $rootScope.$on('loginSuccess', function(event, credentials, email) {
      var customerId = credentials.id;
      IonicUser.set({
        id: credentials.id,
        email: email
      });
      Customer.get(customerId)
      .then(function(customer) {
        CustomerStorage.setIdentity(customer);
        CustomerStorage.setActivated(customer.activated);
        return Address.get(customerId);
      })
      .then(function(address) {
        CustomerStorage.setAddress(address);
        return CustomerSettings.get(customerId);
      })
      .then(function(customerSettings) {
        CustomerStorage.setSettings(customerSettings);
        $rootScope.$broadcast('deviceRegisterStart');
      })
      .catch(function(errorMessage) {
        return Popup.error(errorMessage);
      });
    });

    $rootScope.$on('registerSuccess', function(event, credentials, email) {
      IonicUser.set({
        id: credentials.id,
        email: email
      });
      CustomerStorage.setDefaultSettings();
    });

    $rootScope.$on('logoutSuccess', function(event) {
      Credentials.reset();
      CustomerStorage.reset();
    });
  }

  run.$inject = dependencies;
  app.run(run);
};
