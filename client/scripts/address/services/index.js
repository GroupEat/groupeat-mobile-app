'use strict';

module.exports = function(app) {
    // inject:start
    require('./geocoder')(app);
    // inject:end
};
