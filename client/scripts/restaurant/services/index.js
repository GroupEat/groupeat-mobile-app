'use strict';

module.exports = function(app) {
    // inject:start
    require('./product')(app);
    require('./restaurant')(app);
    // inject:end
};