'use strict';

module.exports = function(app) {
    // inject:start
    require('./cart')(app);
    require('./group-orders')(app);
    require('./orders')(app);
    // inject:end
};
