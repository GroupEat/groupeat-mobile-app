'use strict';

module.exports = function(app) {

  var dependencies = [
    app.name + '.ApplicationUpdater'
  ];

  function run(ApplicationUpdater) {
    ApplicationUpdater.update();
  }

  run.$inject = dependencies;
  app.run(run);
};
