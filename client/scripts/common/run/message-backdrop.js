'use strict';

module.exports = function(app) {

  var dependencies = [
    '$rootScope',
    app.name + '.MessageBackdrop'
  ];

  function run($rootScope, MessageBackdrop) {
    $rootScope.messageBackdrop = {};

    $rootScope.$on('displayMessageBackdrop', function(event, errorKey) {
      $rootScope.messageBackdrop = MessageBackdrop.backdropFromErrorKey(errorKey);
    });

    $rootScope.$on('hideMessageBackdrop', function() {
      $rootScope.messageBackdrop.status = 'hidden';
    });

    $rootScope.$on('$ionicView.afterEnter', function() {
      $rootScope.messageBackdrop.status = 'loading';
    });

    $rootScope.$on('$ionicView.beforeLeave', function() {
      $rootScope.messageBackdrop.status = 'hidden';
    });
  }

  run.$inject = dependencies;
  app.run(run);
};
