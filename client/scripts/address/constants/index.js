'use strict';

module.exports = function(app) {
    // inject:start
    require('./default-geocoded-address')(app);
    // inject:end
};
