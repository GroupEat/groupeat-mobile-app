'use strict';

module.exports = function(app) {

  var dependencies = [
    '$translate',
    'amMoment'
  ];
  
  function run($translate, amMoment) {
    if (typeof navigator.globalization !== 'undefined') {
      navigator.globalization.getPreferredLanguage(function (language) {
        $translate.use(language.value.split('-')[0])
        .then(function (data) {
          console.log('SUCCESS -> ' + data);
          amMoment.changeLocale(data);
        }, function (error) {
          console.log('ERROR -> ' + error);
        });
      }, null);
    }
  }

  run.$inject = dependencies;
  app.run(run);
};
