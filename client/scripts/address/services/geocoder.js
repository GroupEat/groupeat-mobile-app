'use strict';
var servicename = 'Geocoder';

module.exports = function(app) {

  var dependencies = [
    '$q'
  ];

  function service($q) {
    var autocompleter = new google.maps.places.AutocompleteService({
      componentRestrictions: {
        country: 'fr'
      }
    });
    var geocoder = new google.maps.Geocoder();

    var
    autocomplete = function(input) {
      var deferred = $q.defer();
      if (input) {
        autocompleter.getPlacePredictions({input: input}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            deferred.resolve(results || []);
          } else {
            deferred.reject(status);
          }
        });
      } else {
        deferred.resolve([]);
      }
      return deferred;
    },

    placeToAddress = function(placeId) {
      var deferred = $q.defer();
      geocoder.geocode({placeId: placeId}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          const place = results[0];

          debugger;
        } else {
          deferred.reject(status);
        }
      });
      return deferred.promise;
    },

    _getAddressComponent = function(address, componentKey) {
      var addressComponent = _.find(address.address_components, function(addressComponent) {
        return _.includes(addressComponent.types, componentKey);
      });
      return addressComponent ? addressComponent.long_name : undefined;
    },

    formatAddress = function(address) {
      var formattedAddress = {
        city: 'locality',
        postcode: 'postal_code',
        state: 'administrative_area_level_2',
        country: 'country'
      };
      _.forEach(formattedAddress, function(componentKey, key) {
        formattedAddress[key] = _getAddressComponent(address, componentKey);
      });

      var route = _getAddressComponent(address, 'route');
      if (route) {
        var street = '';
        var streetNumber = _getAddressComponent(address, 'street_number');
        if (streetNumber) {
          street += streetNumber + ', ';
        }
        street += route;
      }
      formattedAddress.street = street;
      formattedAddress.latitude = address.geometry.location.lat();
      formattedAddress.longitude = address.geometry.location.lng();

      return formattedAddress;
    };

    return {
      formatAddress: formatAddress,
      autocomplete: autocomplete,
      placeToAddress: placeToAddress
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
