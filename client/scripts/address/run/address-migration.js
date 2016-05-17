'use strict';

module.exports = function(app) {

  var dependencies = [
    app.name + '.defaultGeocodedAddress',
    app.namespace.common + '.StorageMigrator'
  ];

  function run(defaultGeocodedAddress, StorageMigrator) {
    StorageMigrator
    .migrate({
      oldStorageKey: 'address',
      newStorageKey: 'address',
      migrator: function(oldStorageValue, newStorageValue) {
        if (oldStorageValue && oldStorageValue.residency) {
          return defaultGeocodedAddress;
        } else if (newStorageValue) {
          return newStorageValue;
        }
      }
    });
  }

  run.$inject = dependencies;
  app.run(run);
};
