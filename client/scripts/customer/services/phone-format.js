'use strict';
var servicename = 'PhoneFormat';

module.exports = function(app) {

  var dependencies = [];

  function service() {
    var formatPhoneNumberForBackend = function(phoneNumber) {
      if (phoneNumber && phoneNumber.length === 10) {
        phoneNumber = '33' + phoneNumber.substring(1);
      }
      return phoneNumber;
    };

    var formatPhoneNumberForFrontend = function(phoneNumber) {
      if (phoneNumber && phoneNumber.length > 10 && phoneNumber.substring(0,2) === '33') {
        phoneNumber = '0' + phoneNumber.substring(2);
      }
      return phoneNumber;
    };

    return {
      formatPhoneNumberForBackend: formatPhoneNumberForBackend,
      formatPhoneNumberForFrontend: formatPhoneNumberForFrontend
    };

  }
  service.$inject = dependencies;
  app.factory(app.name + '.' + servicename, service);
};
