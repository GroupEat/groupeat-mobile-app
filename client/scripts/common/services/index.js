'use strict';

module.exports = function(app) {
    // inject:start
    require('./backend-utils')(app);
    require('./element-modifier')(app);
    require('./geolocation')(app);
    require('./network')(app);
    require('./lodash')(app);
    require('./popup')(app);
    // inject:end
};
