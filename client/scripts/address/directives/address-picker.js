'use strict';

var directivename = 'geAddressPicker';

module.exports = function(app) {

  var directiveDeps = [
    app.namespace.customer + '.CustomerStorage',
    app.name + '.Geocoder'
  ];

  var directive = function(CustomerStorage, Geocoder) {
    return {
      restrict: 'E',
      scope: {
        onAddressSelect: '&'
      },
      template: require('./address-picker.html'),
      link: function(scope) {
        scope.$watch('address', function(newValue) {
          if (newValue && newValue.length > 3) {
            Geocoder.autocomplete(newValue)
            .then(function(results) {
              scope.results = results;
            });
          }
        });
        scope.selectAddress = function(place) {
          Geocoder.placeToAddress(place).then(function(formattedAddress) {
            CustomerStorage.setForwardGeocodedAddress(formattedAddress);
            scope.onAddressSelect();
          });
        };
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
