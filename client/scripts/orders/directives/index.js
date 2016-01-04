'use strict';

module.exports = function(app) {
    // inject:start
    require('./order-card')(app);
    require('./orders-card')(app);
    // inject:end
};
