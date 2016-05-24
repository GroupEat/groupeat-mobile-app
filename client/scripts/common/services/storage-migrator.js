'use strict';
var servicename = 'StorageMigrator';

module.exports = function(app) {

  var dependencies = [
    app.name + '.Lodash',
    'localStorageService',
  ];

  function service(_, localStorageService) {

    var /**
    * @ngdoc function
    * @name StorageMigrator#migrate
    * @methodOf StorageMigrator
    *
    * @description
    * Run a local storage migration
    * @param {Object} configuration - The configuration of the migration
    */
    migrate = function (configuration) {
      if (_.has(configuration, 'oldStorageKey') && !_.has(configuration, 'newStorageKey')) {
        localStorageService.remove(configuration.oldStorageKey);
      } else if (_.has(configuration, 'newStorageKey') && _.has(configuration, 'migrator')) {
        var migrator = configuration.migrator;
        var newStorageValue = migrator(localStorageService.get(configuration.oldStorageKey), localStorageService.get(configuration.newStorageKey));
        if (newStorageValue) {
          localStorageService.set(configuration.newStorageKey, newStorageValue);
        }
      }
    };

    return {
      migrate: migrate
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
