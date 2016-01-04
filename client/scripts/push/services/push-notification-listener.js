'use strict';
var servicename = 'PushNotificationListener';

module.exports = function(app) {

  var dependencies = [
    app.namespace.common + '.Lodash',
    '$ionicPlatform',
    '$log',
    '$q',
    app.name + '.DeviceAssistant'
  ];

  function service(_, $ionicPlatform, $log, $q, DeviceAssistant) {
    var subscribe = function() {
      var defer = $q.defer();

      $ionicPlatform.ready(function() {
        if (_.isEmpty(ionic.Platform.device())) {
          $log.warn('no device, cancelling notifications subscription');
          defer.reject('no device');
          return;
        }

        var push = PushNotification.init(pushConfig);
        $log.log('notifications initialized', push);

        push.on('registration', function(data) {
          $log.log('notifications registered', data);
          DeviceAssistant.setNotificationToken(data.registrationId);
          defer.resolve();
        });

        push.on('notification', function(data) {
          $log.log('notification received', data);
          DeviceAssistant.update(data.additionalData.notificationId);
        });

        push.on('error', function (error) {
          $log.warn('notifications error', error);
          defer.reject(error);
        });
      });

      return defer.promise;
    };

    return {
      subscribe: subscribe
    };
  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
