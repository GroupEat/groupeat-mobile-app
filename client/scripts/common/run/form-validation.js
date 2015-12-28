'use strict';

module.exports = function(app) {

  var dependencies = [
    'validator',
    app.name + '.ElementModifier',
    app.name + '.ErrorMessageResolver'
  ];

  function run(validator, ElementModifier, ErrorMessageResolver) {
    validator.registerDomModifier(ElementModifier.key, ElementModifier);
    validator.setDefaultElementModifier(ElementModifier.key);
    validator.setErrorMessageResolver(ErrorMessageResolver.resolve);
  }

  run.$inject = dependencies;
  app.run(run);
};
