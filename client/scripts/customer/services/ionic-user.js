'use strict';
var servicename = 'IonicUser';

module.exports = function(app) {

  var dependencies = ['ionicDeployChannel'];

  function service(ionicDeployChannel) {

    var
    init = function() {
      if (!user.id) {
        var anonymousId = Ionic.User.anonymousId();
        Ionic.User.load(anonymousId)
        .then(function(){}, function() {
          user.id = anonymousId;
          user.save();
        });
      }
    },

    get = function(key, defaultValue) {
      if (ionicDeployChannel) {
        return;
      }
      return user.get(key, defaultValue);
    },

    set = function(dict) {
      if (!ionicDeployChannel) {
        return;
      }
      for (var key in dict) {
        user.set(key, dict[key]);
      }
      user.save();
    },

    unset = function(key) {
      if (!ionicDeployChannel) {
        return;
      }
      user.unset(key);
      user.save();
    };

    if (ionicDeployChannel) {
      Ionic.io();
      var user = Ionic.User.current();
      init();
    }

    return {
      get: get,
      set: set,
      unset: unset
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
