'use strict';

module.exports = function(app) {
    // inject:start
    require('./receipt-card')(app);
    require('./restaurant-card')(app);
    // inject:end
};
