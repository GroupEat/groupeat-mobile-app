'use strict';
var servicename = 'ApplicationUpdater';

module.exports = function(app) {

  var dependencies = [
    app.name + '.Lodash',
    '$cordovaToast',
    '$translate',
    'ionicDeployChannel',
  ];

  function service(_, $cordovaToast, $translate, ionicDeployChannel) {

    var update = function () {
      if (ionicDeployChannel) {
        var deploy = new Ionic.Deploy();
        deploy.setChannel(ionicDeployChannel);
        deploy().check().then(function(isDeployAvailable) {
          deploy.download().then(function() {
            deploy.extract().then(function() {
                $translate('updateSuccesful').then(function (updateSuccesful) {
                  $cordovaToast.showShortTop(updateSuccesful);
                });
              }
            }, function(deployExtractError) {
              console.error('deploy extract error : ' + deployExtractError);
            });
          }, function(deployDownloadError) {
            console.error('deploy download error : ' + deployDownloadError);
          });
        }, function(deployCheckError) {
          console.error('deploy check error : ' + deployCheckError);
        });
      }
    };

    return {
      update: update
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
