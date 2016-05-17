'use strict';

module.exports = function(app) {
    // inject:start
    require('./address-migration')(app);
    // inject:end
};
