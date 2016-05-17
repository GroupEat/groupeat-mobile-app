'use strict';
var constantName = 'defaultGeocodedAddress';

module.exports = function(app) {
  app.constant(app.name + '.' + constantName, {
    city: 'Palaiseau',
    country: 'France',
    latitude: 48.7107339,
    longitude: 2.218232700000044,
    postcode: "91120",
    state: "Essonne",
    street: "Allée des Techniques Avancées"
  });
};
