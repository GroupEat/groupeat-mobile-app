'use strict';

var directivename = 'geAddressPicker';

module.exports = function(app) {

  var directiveDeps = [
    '$filter',
    app.namespace.common + '.Lodash',
    app.namespace.customer + '.CustomerStorage',
    app.name + '.Geocoder'
  ];

  var directive = function($filter, _, CustomerStorage, Geocoder) {
    return {
      restrict: 'E',
      scope: {
        onAddressSelect: '&'
      },
      template: require('./address-picker.html'),
      link: function(scope) {

        function matchSelectedAddress(address) {
          return _.has(scope.selectedAddress, 'street') && scope.address === $filter('addressFormat')( scope.selectedAddress);
        }

        function clearResults() {
          scope.results = [];
        }

        scope.$watch('address', function(newValue) {
          if (newValue && newValue.length > 3 && !matchSelectedAddress(newValue)) {
            Geocoder.geocode(newValue)
            .then(function(results) {
              scope.results = results;
            });
          }
        });
        scope.selectAddress = function(address) {
          scope.selectedAddress = Geocoder.formatAddress(address);
          scope.address = $filter('addressFormat')(scope.selectedAddress);
          CustomerStorage.setAddress(scope.selectedAddress);
          clearResults();
          scope.onAddressSelect();
        };
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
