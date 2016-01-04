'use strict';

module.exports = function(app) {

  var dependencies = [
    '$rootScope',
    app.name + '.DeviceAssistant',
    app.namespace.common + '.Network',
    app.name + '.PushNotificationListener'
  ];

  function run($rootScope, DeviceAssistant, Network, PushNotificationListener) {
    Network.hasConnectivity().then(PushNotificationListener.subscribe);
    $rootScope.$on('deviceRegisterStart', DeviceAssistant.register);
  }

  run.$inject = dependencies;
  app.run(run);
};
