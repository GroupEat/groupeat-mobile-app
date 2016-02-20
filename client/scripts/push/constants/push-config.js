'use strict';
var constantName = 'pushConfig';

module.exports = function(app) {
  app.constant(app.name + '.' + constantName, {
    android: {
      senderID: '993639413774',
      icon: 'notification',
      iconColor: '#ff4e50'
    },
    ios: {
      alert: true,
      badge: true,
      sound: true
    }
  });
};
