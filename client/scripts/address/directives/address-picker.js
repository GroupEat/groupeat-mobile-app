'use strict';

var directivename = 'geAddressPicker';

module.exports = function(app) {

  var directiveDeps = [
    app.name + '.Geocoder'
  ];

  var directive = function(Geocoder) {
    return {
      restrict: 'E',
      scope: {
        modal: '='
      },
      template: require('./address-picker.html'),
      link: function(scope) {
        scope.$watch('address', function(newValue) {
          if (newValue && newValue.length > 3) {
            Geocoder.geocode(newValue)
            .then(function(results) {
              scope.results = results;
            });
          }
        });
        scope.selectAddress = function(address) {
          scope.modal.hide();
        };
      }
    };
  };

  directive.$inject = directiveDeps;

  app.directive(directivename, directive);
};
