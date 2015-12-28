'use strict';

module.exports = function(app) {
    // inject:start
    require('./customer-authentication')(app);
    // inject:end
};
