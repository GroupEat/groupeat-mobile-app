'use strict';

module.exports = function(app) {
    // inject:start
    require('./authentication')(app);
    require('./authentication-interceptor')(app);
    require('./credentials')(app);
    require('./device-assistant')(app);
    // inject:end
};
