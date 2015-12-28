'use strict';

module.exports = function(app) {
    // inject:start
    require('./group-orders')(app);
    // inject:end
};
