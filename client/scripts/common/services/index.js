'use strict';

module.exports = function(app) {
    // inject:start
    require('./accept-header-interceptor')(app);
    require('./application-updater')(app);
    require('./backend-utils')(app);
    require('./controller-promise-handler')(app);
    require('./element-modifier')(app);
    require('./error-message-resolver')(app);
    require('./geolocation')(app);
    require('./lodash')(app);
    require('./message-backdrop')(app);
    require('./network')(app);
    require('./popup')(app);
    require('./scroller')(app);
    require('./time-converter')(app);
    // inject:end
};
