'use strict';

var directivename = 'geDeliveryAddress';

module.exports = function(app) {

  var directiveDeps = [
    app.name + '.CustomerStorage',
  ];

  var directive = function(CustomerStorage) {
    return {
      restrict: 'E',
      template: '{{ deliveryAddress.residency | translate }}',
      link: function(scope) {
        scope.deliveryAddress = CustomerStorage.getAddress();
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
