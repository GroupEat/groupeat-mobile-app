'use strict';
var controllername = 'SignupCtrl';

module.exports = function(app) {
  var fullname = app.name + '.' + controllername;
  /*jshint validthis: true */

  var deps = [
    app.namespace.common + '.Lodash',
    '$rootScope',
    '$scope',
    '$state',
    app.namespace.authentication + '.Credentials',
    app.name + '.Customer',
    app.name + '.CustomerStorage',
    app.name + '.IonicUser',
    app.namespace.common + '.Network',
    app.namespace.common + '.Popup'
  ];

  function controller(_, $rootScope, $scope, $state, Credentials, Customer, CustomerStorage, IonicUser, Network, Popup) {
    $scope.user = {};

    $scope.confirmSignup = function() {
      Network.hasConnectivity()
      .then(function() {
        var customerId = Credentials.get().id;
        var customerParams = _.pick($scope.user, ['phoneNumber']);
        return Customer.update(customerId, customerParams);
      })
      .then(function(customer) {
        IonicUser.set(_.omit(customer, ['activated']));
        CustomerStorage.setIdentity(customer);
        $rootScope.$broadcast('deviceRegisterStart');
        $state.go('app.group-orders');
      })
      .catch(function(errorMessage) {
        Popup.error(errorMessage);
      });
    };
  }

  controller.$inject = deps;
  app.controller(fullname, controller);
};
