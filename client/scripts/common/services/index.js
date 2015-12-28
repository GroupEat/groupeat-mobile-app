'use strict';

module.exports = function(app) {
    // inject:start
    require('./backend-utils')(app);
    require('./controller-promise-handler')(app);
    require('./element-modifier')(app);
    require('./geolocation')(app);
    require('./lodash')(app);
    require('./network')(app);
    require('./popup')(app);
    // inject:end
};
