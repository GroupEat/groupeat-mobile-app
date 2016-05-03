'use strict';

module.exports = function(app) {
    // inject:start
    require('./address-picker')(app);
    require('./delivery-address')(app);
    // inject:end
};
