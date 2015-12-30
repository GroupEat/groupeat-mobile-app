'use strict';

module.exports = function(app) {

  var dependencies = [
    '$translateProvider'
  ];

  function config($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/',
      suffix: '.json'
    }).preferredLanguage('fr').fallbackLanguage(['fr']).useLocalStorage();
  }

  config.$inject = dependencies;
  app.config(config);
};
