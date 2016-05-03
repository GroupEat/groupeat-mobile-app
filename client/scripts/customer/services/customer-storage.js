'use strict';
var servicename = 'CustomerStorage';

module.exports = function(app) {

  var dependencies = [
    'localStorageService',
    app.name + '.IonicUser'
  ];

  function service(localStorageService, IonicUser) {

    var
    setActivated = function(activated) {
      localStorageService.set('activatedAccount', activated);
    },

    setForwardGeocodedAddress = function(address) {
      localStorageService.set('forwardGeocodedAddress', address);
    },

    setOldAddress = function(address) {
      if(address) {
        localStorageService.set('address', address);
      }
    },

    setIdentity = function(identity) {
      if(identity) {
        localStorageService.set('identity', identity);
      }
    },

    setSettings = function(settings) {
      if(settings) {
        localStorageService.set('settings', settings);
      }
    },

    setDefaultSettings = function() {
      var settings = {
        'notificationsEnabled' : true,
        'daysWithoutNotifying': '2',
        'noNotificationAfter': '23:00:00'
      };
      IonicUser.set(settings);
      localStorageService.set('settings', settings);
    },

    reset = function () {
      localStorageService.remove('settings');
      localStorageService.remove('identity');
      localStorageService.remove('settings');
      localStorageService.remove('address');
      localStorageService.remove('activatedAccount');
    },

    getActivated = function() {
      return localStorageService.get('activatedAccount') === 'true';
    },

    getAddress = function() {
      if (localStorageService.get('forwardGeocodedAddress')) {
        return localStorageService.get('forwardGeocodedAddress');
      } else if (localStorageService.get('address')) {
        return localStorageService.get('address');
      } else {
        return {residency: "ENSTAParisTech"};
      }
    },

    getIdentity = function() {
      return localStorageService.get('identity') || {};
    },

    getSettings = function() {
      return localStorageService.get('settings') || {};
    };

    return {
      setForwardGeocodedAddress: setForwardGeocodedAddress,
      setOldAddress: setOldAddress,
      setActivated: setActivated,
      setIdentity: setIdentity,
      setSettings: setSettings,
      setDefaultSettings: setDefaultSettings,
      reset: reset,
      getActivated: getActivated,
      getAddress: getAddress,
      getIdentity: getIdentity,
      getSettings: getSettings
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
