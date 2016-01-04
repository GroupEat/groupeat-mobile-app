'use strict';

module.exports = function(app) {
    // inject:start
    require('./device-assistant')(app);
    require('./push-notification-listener')(app);
    // inject:end
};
