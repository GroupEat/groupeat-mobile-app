'use strict';

module.exports = function(app) {
    // inject:start
    require('./group-orders')(app);
    require('./orders')(app);
    // inject:end
};
