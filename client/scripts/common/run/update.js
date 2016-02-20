'use strict';

module.exports = function(app) {

  var dependencies = [
    '$ionicPlatform',
    app.name + '.ApplicationUpdater'
  ];

  function run($ionicPlatform, ApplicationUpdater) {
    $ionicPlatform.ready(ApplicationUpdater.update);
  }

  run.$inject = dependencies;
  app.run(run);
};
