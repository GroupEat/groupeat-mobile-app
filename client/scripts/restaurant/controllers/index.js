'use strict';

module.exports = function(app) {
    // inject:start
    require('./restaurant-menu')(app);
    require('./restaurants')(app);
    // inject:end
};
