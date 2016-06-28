'use strict';

var directivename = 'geAddressPicker';

module.exports = function(app) {

  var directiveDeps = [
    app.namespace.common + '.Lodash',
    app.name + '.Autocompleter',
    app.namespace.customer + '.CustomerStorage',
    app.name + '.Geocoder'
  ];

  var directive = function(_, Autocompleter, CustomerStorage, Geocoder) {
    return {
      restrict: 'E',
      scope: {
        selectedAddress: '=',
        onAddressSelect: '&'
      },
      template: require('./address-picker.html'),
      link: function(scope) {

        function matchSelectedAddress(address) {
          return _.has(scope.selectedAddress, 'street') && scope.address === scope.selectedAddress.street;
        }

        function clearResults() {
          scope.results = [];
        }

        scope.$watch('address', function(newValue) {
          if (newValue && newValue.length > 3 && !matchSelectedAddress(newValue)) {
            Autocompleter.getResults(newValue)
            .then(function(results) {
              scope.results = results;
            });
          }
        });

        scope.pick = function(result) {
          Geocoder.getAddress(result)
          .then(function(address) {
            _.assign(scope.selectedAddress, address);
            scope.address = scope.selectedAddress.street;
            clearResults();
            scope.onAddressSelect();
          });
        };
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
