'use strict';

var directivename = 'geDeliveryAddress';

module.exports = function(app) {

  var directiveDeps = [
    '$ionicModal',
    app.namespace.common + '.Lodash',
    app.namespace.customer + '.CustomerStorage'
  ];

  var directive = function($ionicModal, _, CustomerStorage) {
    return {
      restrict: 'E',
      scope: {
        onAddressSelect: '&'
      },
      template: require('./delivery-address.html'),
      link: function(scope) {
        scope.deliveryAddress = CustomerStorage.getAddress();
        scope.selectedAddress = {};
        scope.modal = $ionicModal.fromTemplate(require('../../address/views/address-picker-modal.html'), {
          scope: scope,
          animation: 'slide-in-up'
        });
        scope.$on('$destroy', function() {
          scope.modal.remove();
        });

        scope.saveSelectedAddress = function() {
          scope.deliveryAddress = _.clone(scope.selectedAddress);
          CustomerStorage.setAddress(scope.selectedAddress);
          scope.modal.hide();
          scope.onAddressSelect();
        };
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
