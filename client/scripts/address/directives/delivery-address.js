'use strict';

var directivename = 'geDeliveryAddress';

module.exports = function(app) {

  var directiveDeps = [
    '$ionicModal',
    app.namespace.customer + '.CustomerStorage'
  ];

  var directive = function($ionicModal, CustomerStorage) {
    return {
      restrict: 'E',
      scope: {
        onAddressSelect: '&'
      },
      template: require('./delivery-address.html'),
      link: function(scope) {
        scope.deliveryAddress = CustomerStorage.getAddress();
        scope.modal = $ionicModal.fromTemplate(require('../../address/views/address-picker-modal.html'), {
          scope: scope,
          animation: 'slide-in-up'
        });
        scope.$on('$destroy', function() {
          scope.modal.remove();
        });
        scope.selectAddress = function() {
          scope.deliveryAddress = CustomerStorage.getAddress();
          scope.onAddressSelect();
        };
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
