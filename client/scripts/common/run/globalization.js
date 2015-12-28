'use strict';

module.exports = function(app) {

  var dependencies = [
    '$translate'
  ];
  
  function run($translate) {
    if (typeof navigator.globalization !== 'undefined') {
      navigator.globalization.getPreferredLanguage(function (language) {
        $translate.use(language.value.split('-')[0])
        .then(function (data) {
          console.log('SUCCESS -> ' + data);
        }, function (error) {
          console.log('ERROR -> ' + error);
        });
      }, null);
    }
  }

  run.$inject = dependencies;
  app.run(run);
};
