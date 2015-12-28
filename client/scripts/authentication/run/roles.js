'use strict';

module.exports = function(app) {

  var dependencies = [
    app.name + '.Credentials',
    'Permission'
  ];

  function run(Credentials, Permission) {
    Permission.defineRole('customer', function() {
      return Credentials.get();
    });
  }

  run.$inject = dependencies;
  app.run(run);
};
