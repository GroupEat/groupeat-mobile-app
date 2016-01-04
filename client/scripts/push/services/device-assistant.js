'use strict';
var servicename = 'DeviceAssistant';

module.exports = function(app) {

  var dependencies = [
    app.namespace.common + '.Lodash',
    '$ionicPlatform',
    '$q',
    '$resource',
    'apiEndpoint',
    app.namespace.authentication + '.Credentials',
    app.namespace.common + '.Geolocation'
  ];

  function service(_, $ionicPlatform, $q, $resource, apiEndpoint, Credentials, Geolocation) {
    var notificationToken;
    var registerResource = $resource(apiEndpoint + '/customers/:customerId/devices');
    var updateResource = $resource(
      apiEndpoint + '/customers/:customerId/devices/:deviceUUID',
      null,
      {update: {method: 'PUT'}}
    );

    var getDeviceDetails = function() {
      var defer = $q.defer();

      $ionicPlatform.ready(function() {
        if (_.isEmpty(ionic.Platform.device())) {
          defer.reject('no device');
          return;
        }

        var platform;

        if (ionic.Platform.isAndroid()) {
          platform = 'android';
        } else if (ionic.Platform.isIOS()) {
          platform = 'ios';
        } else {
          defer.reject('OS not supported');
          return;
        }

        var device = ionic.Platform.device();

        var details = {
          UUID: device.uuid,
          platform: platform,
          platformVersion: device.version,
          model: device.model
        };

        Geolocation.getGeolocation()
        .then(function(location) {
          details.location = _.pick(location.coords, ['latitude', 'longitude']);
          defer.resolve(details);
        })
        .catch(function() { defer.resolve(details); });
      });

      return defer.promise;
    };

    var register = function() {
      return getDeviceDetails()
      .then(function(details) {
        if (notificationToken) {
          details.notificationToken = notificationToken;
        }

        return registerResource.save({ customerId: Credentials.get(false).id }, details).$promise;
      });
    };

    var update = function(notificationId) {
      if (!Credentials.isAuthenticated()) {
        return $q.reject('not authenticated');
      }

      return getDeviceDetails()
      .then(function(details) {
        var UUID = details.UUID;
        details.UUID = undefined;

        if (notificationToken) {
          details.notificationToken = notificationToken;
        }

        if (notificationId) {
          details.notificationId = notificationId;
        }

        return updateResource.update({
          customerId: Credentials.get(false).id,
          deviceUUID: UUID
        }, details).$promise;
      });
    };

    var setNotificationToken = function(token) {
      notificationToken = token;
    };

    return {
      register: register,
      update: update,
      setNotificationToken: setNotificationToken,
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
