'use strict';

module.exports = function(app) {
    // inject:start
    require('./credentials')(app);
    require('./device-assistant')(app);
    // inject:end
};
