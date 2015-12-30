'use strict';

module.exports = function(app) {

  var dependencies = [
    '$ionicAnalytics'
  ];

  function run($ionicAnalytics) {
    $ionicAnalytics.register();
  }

  run.$inject = dependencies;
  app.run(run);
};
