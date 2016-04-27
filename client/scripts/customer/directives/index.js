'use strict';

module.exports = function(app) {
    // inject:start
    require('./delivery-address')(app);
    // inject:end
};
